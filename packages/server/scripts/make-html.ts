import crypto from 'crypto'

import scopeCss from '@patarapolw/scope-css'
import cheerio from 'cheerio'
import ejs from 'ejs'
import hljs from 'highlight.js'
import hljsDefineVue from 'highlightjs-vue/vue'
import showdown from 'showdown'

hljsDefineVue(hljs)

export class MakeHtml {
  private $ = cheerio.load('')
  private mdConverter = new showdown.Converter({
    parseImgDimensions: true,
    strikethrough: true,
    tables: true,
    disableForced4SpacesIndentedSublists: true,
    openLinksInNewWindow: true,
    emoji: true,
    underline: true,
    metadata: true,
  })

  constructor() {
    this.mdConverter.addExtension(
      {
        type: 'lang',
        regex: /\\\n/g,
        replace: '<br />',
      },
      'commonmark-simple-linebreak'
    )

    /**
     * ! For some reasons default underscore italic fails to render...
     */
    this.mdConverter.addExtension(
      {
        type: 'lang',
        regex: /( [^\\])_{1}(.*?[^\\])_{1}( )/g,
        replace: '$1<i>$2</i>$3',
      },
      'underscore-italic'
    )

    /**
     * ! This is the only way to preserve syntax highlighting, while output multiline strings correctly
     */
    this.mdConverter.addExtension(
      {
        type: 'lang',
        regex: /(^|\n)```html parsed([^]+)\n```\n/g,
        replace: (_: string, p1: string, p2: string) => {
          return (
            p1 +
            ejs.render(p2, {
              rmWhitespace: true,
              beautify: false,
            })
          )
        },
      },
      'html-parsed'
    )

    // https://github.com/Bloggify/showdown-highlight
    this.mdConverter.addExtension(
      {
        type: 'output',
        filter(text) {
          const classAttr = 'class="'
          let left = '<pre><code\\b[^>]*>',
            right = '</code></pre>',
            flags = 'g',
            replacement = (...[, match = '', left = '', right]: string[]) => {
              match = require('html-encoder-decoder').decode(match)
              let lang = (left.match(/class=\"([^ \"]+)/) || [])[1]

              if (left.includes(classAttr)) {
                let attrIndex = left.indexOf(classAttr) + classAttr.length
                left =
                  left.slice(0, attrIndex) + 'hljs ' + left.slice(attrIndex)
              } else {
                left = left.slice(0, -1) + ' class="hljs">'
              }

              if (lang && hljs.getLanguage(lang)) {
                return left + hljs.highlight(lang, match).value + right
              } else {
                return left + hljs.highlightAuto(match).value + right
              }
            }
          return showdown.helper.replaceRecursiveRegExp(
            text,
            replacement,
            left,
            right,
            flags
          )
        },
      },
      'highlight.js'
    )
  }

  async renderFile(
    filename: string
  ): Promise<{
    html: string[]
    text: string[]
  }> {
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
          this.$('<div>')
            .append(
              this.$('<x-card>')
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
                  this.$('<a>')
                    .attr({
                      href,
                      target: '_blank',
                      rel: 'noopener',
                    })
                    .text(href)
                )
            )
            .html() || ''
        )
      },
      youtube: ({ href }: { href: string }) => {
        return (
          this.$('<div>')
            .append(
              this.$('<figure>')
                .addClass('image is-16by9 responsive-iframe')
                .append(
                  this.$('<iframe>')
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

    const id =
      'md-' +
      crypto
        .createHash('sha256')
        .update(markdown)
        .digest()
        .toString('hex')
        .substring(0, 8)

    const rawHtml = this.mdConverter.makeHtml(markdown)

    const $div = this.$('<div>')
      .attr({
        class: id,
      })
      .html(rawHtml)

    $div.find('style').each((_, el) => {
      const $el = this.$(el)
      const css = $el.html()

      if (css) {
        $el.html(scopeCss(css, `.${id}`))
      }
    })

    const html = (this.$('<div>').append($div).html() || '').split(
      /<!-- excerpt(?:_separator)? -->/
    )
    const text = html.map((h) => this.$('<div>').html(h).text())

    return {
      html,
      text,
    }
  }
}
