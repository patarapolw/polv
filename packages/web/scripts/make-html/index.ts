import path from 'path'
import cheerio from 'cheerio'
import ejs from 'ejs'
import fetch from 'node-fetch'
import fs from 'fs-extra'
import scopeCss from 'scope-css'
import sharp from 'sharp'
import showdown from 'showdown'
import { dstMediaPath, srcMediaPath } from '../dir'
import { matter } from './matter'

export class MakeHtml {
  public md: showdown.Converter

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onCmChanged = (): void => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPrismChanged = (): void => {}

  constructor(public id: string, public cache: CacheMedia) {
    this.id = 'el-' + hashFnv32a(id)
    this.md = new showdown.Converter({
      parseImgDimensions: true,
      strikethrough: true,
      tables: true,
      disableForced4SpacesIndentedSublists: true,
      openLinksInNewWindow: true,
      emoji: true,
      underline: true,
    })
  }

  async renderFile(
    filename: string
  ): Promise<{
    header: Record<string, any>
    html: string
    excerptHtml: string
    excerpt: string
  }> {
    const $ = cheerio.load('<body>')

    const markdown = await ejs.renderFile(filename, {
      xCard: ({
        href,
        image,
        title,
        description,
      }: {
        href: string
        image?: string
        title: string
        description: string
      }) => {
        return (
          $('<div>')
            .append(
              $('<x-card>')
                .attr(
                  JSON.parse(
                    JSON.stringify({
                      href,
                      image,
                      title,
                      description,
                    })
                  ) as Record<string, string>
                )
                .append(
                  $('<a>')
                    .attr({
                      href,
                      target: '_blank',
                      rel: 'noopener noreferrer nofollow',
                    })
                    .text(href)
                )
            )
            .html() || ''
        )
      },
      youtube: ({ href }: { href: string }) => {
        return (
          $('<div>')
            .append(
              $('<figure>')
                .addClass('image is-16by9 responsive-iframe')
                .append(
                  $('<iframe>')
                    .addClass('has-ratio')
                    .attr({
                      frameborder: 0,
                      allow:
                        'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                      allowfullscreen: '',
                      src: href.startsWith('https://')
                        ? href
                        : `https://www.youtube.com/embed/${href}`,
                    })
                )
            )
            .html() || ''
        )
      },
    })

    const { data: header, content } = matter.parse(markdown)

    $('body').append(
      $('<div>')
        .attr({
          class: this.id,
        })
        .html(this.md.makeHtml(content))
    )

    await Promise.all(
      Array.from($('img')).map(async (el) => {
        const $el = $(el)
        if ($el.parent('picture').length) {
          return
        }

        const src = $el.attr('src')

        if (src) {
          const { imWebp, imPng } = await this.cache.localizeImage(src, {
            width:
              ($el
                ? parseInt($el.attr('width') || '') ||
                  parseInt($el.attr('data-width') || '') ||
                  styleSizeToNumber($el.css('width'))
                : null) || 800,
            height: $el
              ? parseInt($el.attr('height') || '') ||
                parseInt($el.attr('data-height') || '') ||
                styleSizeToNumber($el.css('height'))
              : null,
          })

          const s1 = $('<source>').attr({
            srcset: imWebp,
            type: 'image/webp',
          })
          const s2 = $('<source>').attr({
            srcset: imPng,
            type: 'image/png',
          })
          const img = $el.clone().attr({
            src: imPng,
          })

          $el.replaceWith($('<picture>').append(s1).append(s2).append(img))
        }
      })
    )

    $('style').each((_, el) => {
      const $el = $(el)
      const css = $el.html()

      if (css) {
        $el.html(scopeCss(css, `.${this.id}`))
      }
    })

    const html = $('body').html() || ''
    const excerptHtml = html.split(/<!-- excerpt(?:_separator)? -->/)[0]

    return {
      header,
      html,
      excerptHtml,
      excerpt: $('<div>').html(excerptHtml).text(),
    }
  }
}

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {string}
 */
function hashFnv32a(str: string, seed?: number): string {
  /* jshint bitwise:false */
  let i
  let l
  // eslint-disable-next-line prettier/prettier
  // eslint-disable-next-line unicorn/number-literal-case
  let hval = seed === undefined ? 0x811c9dc5 : seed

  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i)
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24)
  }

  return (hval >>> 0).toString(36)
}

export function styleSizeToNumber(s: string) {
  return s && s.endsWith('px') ? parseInt(s) : null
}

export class CacheMedia {
  cache: Record<string, string> = {}

  constructor() {
    if (fs.existsSync(srcMediaPath('cache.json'))) {
      this.cache = JSON.parse(
        fs.readFileSync(srcMediaPath('cache.json'), 'utf-8')
      )
    }
  }

  close() {
    fs.writeFileSync(
      srcMediaPath('cache.json'),
      JSON.stringify(this.cache, null, 2)
    )
  }

  async localizeImage(
    src: string,
    size?: {
      width: number
      height: number | null
    }
  ) {
    if (!size) {
      const m = / =(?<w>\d+)x(?<h>\d+)?/.exec(src)
      if (m && m.groups) {
        size = {
          width: parseInt(m.groups.w) || 800,
          height: parseInt(m.groups.h) || null,
        }
      }
    }

    const makeExt = (b: string, ext: string) => {
      return b.replace(/\.[A-Z0-9]+$/i, '') + ext
    }

    let imWebp = ''
    let imPng = ''

    if (/^https?:\/\//.test(src)) {
      let base = this.cache[src]

      if (!base) {
        let folder = Math.random().toString(36).substr(2)
        while (fs.existsSync(dstMediaPath(folder))) {
          folder = Math.random().toString(36).substr(2)
        }

        await fs.ensureDir(dstMediaPath(folder))

        base = path.join(
          folder,
          src.replace(/^.+\//, '').replace(/\?.+$/, '').replace(/#.+$/, '') ||
            'image'
        )

        this.cache[src] = base

        const b: Buffer = await fetch(src).then((r) => r.buffer())
        let s = sharp(b)

        if (size) {
          s = s.resize(size.width, size.height, {
            withoutEnlargement: true,
            fit: 'outside',
          })
        }

        await Promise.all([
          s.toFile(dstMediaPath(makeExt(base, '.webp'))),
          s.toFile(dstMediaPath(makeExt(base, '.png'))),
        ])
      }

      imWebp = '/media/' + makeExt(base, '.webp')
      imPng = '/media/' + makeExt(base, '.png')
    } else {
      imWebp = '/media/' + makeExt(src, '.webp')
      imPng = '/media/' + makeExt(src, '.png')
    }

    return { imWebp, imPng }
  }
}
