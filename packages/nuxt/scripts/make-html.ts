import crypto from 'crypto'

import scopeCss from '@patarapolw/scope-css'
import cheerio from 'cheerio'
import ejs from 'ejs'
import showdown from 'showdown'

export class MakeHTML {
  $ = cheerio.load('')

  mdConverter = new showdown.Converter({
    noHeaderId: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    // literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    // simpleLineBreaks: true,
    openLinksInNewWindow: true,
    backslashEscapesHTMLTags: true,
    emoji: true,
    underline: true,
    disableForced4SpacesIndentedSublists: true,
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
        regex: /([^\\])_{1}(.*?[^\\])_{1}/g,
        replace: '$1<i>$2</i>',
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
  }

  async parse(
    filename: string
  ): Promise<{
    $: cheerio.Cheerio
    html(): string
    clean(): string
  }> {
    const id =
      'md-' +
      crypto
        .createHash('sha256')
        .update(filename)
        .digest()
        .toString('hex')
        .substr(0, 8)

    const $div = this.$(`<div id="${id}">`)
    $div.html(await this.getHTML(filename))
    $div.find('style').each((_, el) => {
      const $el = this.$(el)
      const html = $el.html() || ''
      if (html.trim()) {
        $el.html(scopeCss(html, `#${id}`))
      }
    })

    return {
      $: $div,
      html: () => {
        return this.$('<div>').append($div).html() || ''
      },
      clean: () => {
        return $div.text() || ''
      },
    }
  }

  private async getHTML(filename: string) {
    return this.mdConverter.makeHtml(
      await ejs.renderFile(filename, {
        youtube: (id: string) =>
          ejs.render(
            /* html */ `
          <div style="position:relative;padding-top:56.25%;">
            <iframe src="https://www.youtube.com/embed/${id}"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>
          </div>`,
            { rmWhitespace: true, beautify: false }
          ),
        xCard: (opts: {
          href: string
          image?: string
          title: string
          description?: string
        }) =>
          this.$('<div>')
            .append(
              this.$('<x-card>')
                .attr(opts)
                .append(
                  this.$('<a>')
                    .attr({
                      href: opts.href,
                      rel: 'noopener',
                      target: '_blank',
                    })
                    .text(opts.title)
                )
            )
            .html(),
      })
    )
  }
}
