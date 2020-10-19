import cheerio from 'cheerio'
import ejs from 'ejs'
import fs from 'fs-extra'
import fetch from 'node-fetch'
import scopeCss from 'scope-css'
import sharp from 'sharp'
import showdown from 'showdown'

import { srcMediaPath } from '../dir'
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
        image: string
        title: string
        description: string
      }) => {
        return (
          $('div')
            .append(
              $('x-card')
                .attr({
                  href,
                  image,
                  title,
                  description,
                })
                .append(
                  $('a')
                    .attr({
                      href,
                      target: '_blank',
                      rel: 'noopenner noreferrer',
                    })
                    .text(href)
                )
            )
            .html() || ''
        )
      },
    })

    const { data: header, content } = matter.parse(markdown)

    $('body').append(
      $('div')
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

          const s1 = $('source').attr({
            srcset: imWebp,
            type: 'image/webp',
          })
          const s2 = $('source').attr({
            srcset: imPng,
            type: 'image/png',
          })
          const img = $el.clone().attr({
            src: imPng,
          })

          $el.replaceWith($('picture').append(s1).append(s2).append(img))
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

    return {
      header,
      html: $('body').html() || '',
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
    fs.writeFileSync(srcMediaPath('cache.json'), JSON.stringify(this.cache))
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
      const base =
        src.replace(/^.+\//, '').replace(/\?.+$/, '').replace(/#.+$/, '') ||
        'image'

      imWebp = makeExt(base, '.webp')
      imPng = makeExt(base, '.png')

      if (!this.cache[src]) {
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
          s.toFile(makeExt(base, '.webp')),
          s.toFile(makeExt(base, '.png')),
        ])
      }
    } else {
      imWebp = makeExt(src, '.webp')
      imPng = makeExt(src, '.png')
    }

    return { imWebp, imPng }
  }
}
