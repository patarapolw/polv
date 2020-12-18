import Document, { Head, Html, Main, NextScript } from 'next/document'

import { ServerStyleSheet } from 'styled-components'
import { THEME } from '~/assets/global'

class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />)
        })
      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render () {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta name="description" content={THEME.description} />

          <link
            rel="shortcut icon"
            href="/media/favicon.ico"
            type="image/x-icon"
          />

          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css"
          />

          {THEME.sidebar?.twitter ? (
            <script
              src="https://platform.twitter.com/widgets.js"
              async
              charSet="utf8"
            ></script>
          ) : null}

          {THEME.analytics?.plausible ? (
            <script
              src="https://plausible.io/js/plausible.js"
              async
              defer
              data-domain={THEME.analytics.plausible}
            />
          ) : null}

          <script
            src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"
            defer
          />
          <script type="module" src="/webcomponents.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
