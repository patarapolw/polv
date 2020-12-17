import fs from 'fs'

import { NuxtConfig } from '@nuxt/types'

import { getTheme } from './server/theme'

const config = async (): Promise<NuxtConfig> => {
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
    },
    serverMiddleware: [{ path: '/api', handler: '~/server/index.ts' }],
    build: {
      postcss: {
        preset: {
          features: {
            customProperties: false,
          },
        },
      },
    },
    env: {
      THEME: JSON.stringify(theme),
      TAG: fs.readFileSync('./build/tag.json', 'utf-8'),
    },
  }
}

export default config
