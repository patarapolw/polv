import { NuxtConfig } from '@nuxt/types'
import axios from 'axios'
import waitOn from 'wait-on'

import type { ITheme } from './store'

export default async (): Promise<NuxtConfig> => {
  const apiURL =
    process.env.BASE_URL || `http://localhost:${process.env.SERVER_PORT}`

  await waitOn({
    resources: [apiURL],
  })

  const theme: ITheme = await axios
    .get('/api/theme.json', {
      baseURL: apiURL,
    })
    .then((r) => r.data)

  return {
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
      ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
      '~/styles/app.scss',
      '~/node_modules/highlight.js/styles/night-owl.css',
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
      '~/plugins/format.ts',
      '~/plugins/remark42.client.ts',
      '~/plugins/webcomponents.client.js',
    ],

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
      // https://go.nuxtjs.dev/axios
      '@nuxtjs/axios',
      // https://go.nuxtjs.dev/pwa
      '@nuxtjs/pwa',
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
      proxy: true,
    },
    proxy: {
      '/api': `http://localhost:${process.env.SERVER_PORT}`,
    },

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
      manifest: {
        lang: 'en',
      },
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
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
    },
    server: {
      port: process.env.PORT,
    },
  }
}
