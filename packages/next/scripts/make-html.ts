import cheerio from 'cheerio'
import crypto from 'crypto'
import ejs from 'ejs'
import scopeCss from '@patarapolw/scope-css'
import showdown from 'showdown'

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
    metadata: true
  })

  constructor () {
    this.mdConverter.addExtension(
      {
        type: 'lang',
        regex: /\\\n/g,
        replace: '<br />'
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
        replace: '$1<i>$2</i>$3'
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
              beautify: false
            })
          )
        }
      },
      'html-parsed'
    )
  }

  async parse (
    filename: string
  ): Promise<{
    html: string
    text: string
  }> {
    const markdown = await ejs.renderFile(filename, {
      xCard: ({
        href,
        image,
        title,
        description
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
                      description
                    })
                  ) as Record<string, string>
                )
                .append(
                  this.$('<a>')
                    .attr({
                      href,
                      target: '_blank',
                      rel: 'noopener'
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
                        : `https://www.youtube.com/embed/${href}`
                    })
                )
            )
            .html() || ''
        )
      }
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
        class: id
      })
      .html(rawHtml)

    $div.find('style').each((_, el) => {
      const $el = this.$(el)
      const css = $el.html()

      if (css) {
        $el.html(scopeCss(css, `.${id}`))
      }
    })

    return {
      html: this.$('<div>').append($div).html() || '',
      text: $div.text()
    }
  }
}
