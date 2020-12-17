import fs from 'fs'

import { NuxtConfig } from '@nuxt/types'

import { SERVER_PORT, runServer } from './server/cli'
import { getTheme } from './server/theme'

const config = async (): Promise<NuxtConfig> => {
  await runServer()
  const theme = getTheme()

  return {
    target: 'static',
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: theme.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: theme.description || '',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/media/favicon.ico' }],
      script: [
        ...(theme.sidebar?.twitter
          ? [
              {
                src: 'https://platform.twitter.com/widgets.js',
                async: true,
                charset: 'utf-8',
              },
            ]
          : []),
        ...(theme.analytics?.plausible
          ? [
              {
                src: 'https://plausible.io/js/plausible.js',
                async: true,
                defer: true,
                'data-domain': theme.analytics?.plausible,
              },
            ]
          : []),
        {
          src:
            'https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js',
          defer: true,
        },
        {
          type: 'module',
          src: '/webcomponents.js',
        },
      ],
    },
    css: [
      '~/styles/app.scss',
      '~/node_modules/highlight.js/styles/night-owl.css',
    ],
    plugins: [
      '~/plugins/axios-fix.ts',
      '~/plugins/fontawesome.ts',
      '~/plugins/format.ts',
    ],
    components: true,
    buildModules: ['@nuxt/typescript-build'],
    modules: [
      '@nuxtjs/bulma',
      '@nuxtjs/axios',
      [
        'nuxt-mq',
        {
          defaultBreakpoint: 'desktop',
          breakpoints: {
            mobile: 600,
            tablet: 1024,
            desktop: Infinity,
          },
        },
      ],
    ],
    axios: {
      proxy: true,
    },
    proxy: {
      '/.netlify/functions': 'http://localhost:9000',
      '/api': `http://localhost:${SERVER_PORT}`,
    },
    build: {
      postcss: {
        preset: {
          features: {
            customProperties: false,
          },
        },
      },
    },
    hooks: {
      generate: {
        done() {
          /**
           * Do not kill
           */
          // try {
          //   execSync(
          //     `lsof -i tcp:${SERVER_PORT} | grep LISTEN | awk '{print $2}' | xargs kill -9`
          //   )
          // } catch (_) {}
          process.exit(0)
        },
      },
    },
    env: {
      THEME: JSON.stringify(theme),
      TAG: fs.readFileSync('./build/tag.json', 'utf-8'),
      SERVER_PORT: SERVER_PORT.toString(),
    },
  }
}

export default config
