import { NuxtConfig } from '@nuxt/types'
import axios from 'axios'

import { RAW, THEME } from './server/db/raw'

// eslint-disable-next-line require-await
export default async (): Promise<NuxtConfig> => {
  const theme = THEME.get()
  const raw = RAW.get()
  const tag = Object.values(raw)
    .flatMap(({ tag = [] }) => tag)
    .reduce(
      (prev, c) => ({
        ...prev,
        [c]: (prev[c] || 0) + 1,
      }),
      {} as Record<string, number>
    )
  const apiURL = `http://localhost:${process.env.npm_package_config_serverPort}`

  return {
    // Target: https://go.nuxtjs.dev/config-target
    target: 'static',

    // Global page headers: https://go.nuxtjs.dev/config-head
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
      link: [{ rel: 'icon', type: 'image/x-icon', href: theme.favicon }],
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
      ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
      '~/styles/app.scss',
      '~/node_modules/highlight.js/styles/night-owl.css',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['~/plugins/format.ts', '~/plugins/webcomponents.client.js'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
      // https://go.nuxtjs.dev/typescript
      '@nuxt/typescript-build',
      'nuxt-typed-vuex',
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

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
      // https://go.nuxtjs.dev/buefy
      [
        'nuxt-buefy',
        {
          defaultIconPack: 'fas',
          defaultIconComponent: 'FontAwesome',
        },
      ],
      [
        '@nuxtjs/fontawesome',
        {
          component: 'FontAwesome',
          icons: {
            brands: [
              'faFacebookF',
              'faGithub',
              'faInstagram',
              'faLinkedinIn',
              'faQuora',
              'faReddit',
              'faTwitter',
            ],
            solid: ['faAt', 'faCaretLeft', 'faCaretRight', 'faSearch'],
          },
        },
      ],
      '@nuxtjs/proxy',
    ],
    proxy: {
      '/.netlify': {
        target: 'http://localhost:9000',
      },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},
    generate: {
      routes() {
        return [
          ...Object.keys(raw).map((p) => `/post/${p}`),
          ...Object.keys(tag).map((p) => `/tag/${p}`),
        ]
      },
    },
    env: {
      THEME: JSON.stringify(theme),
      API_URL: apiURL,
      TAG: JSON.stringify(tag),
    },
    server: {
      port: process.env.PORT,
    },
    hooks: {
      generate: {
        done() {
          axios.delete('/', {
            baseURL: apiURL,
          })
        },
      },
    },
  }
}
