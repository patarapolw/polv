import fs from 'fs'
import path from 'path'

import { NuxtConfig } from '@nuxt/types'
import yaml from 'js-yaml'
import * as z from 'zod'

import getServer from './serverMiddleware'
import { CONTENT_PATH } from './scripts/dir'

export const zRemark42 = () =>
  z.object({
    host: z.string(),
    siteId: z.string(),
    locale: z.string().optional(),
  })

export type IRemark42 = z.infer<ReturnType<typeof zRemark42>>

export const zAuthor = () =>
  z.object({
    name: z.string(),
    email: z.string().optional(),
    url: z.string().optional(),
    image: z.string(),
  })

export type IAuthor = z.infer<ReturnType<typeof zAuthor>>

export const zTabs = () =>
  z.array(
    z.object({
      name: z.string(),
      id: z.string(),
      q: z.string(),
    })
  )

export type ITabs = z.infer<ReturnType<typeof zTabs>>

export const zSidebar = () =>
  z.object({
    twitter: z.string().optional(),
    tagCloud: z.boolean().optional(),
  })

export type ISidebar = z.infer<ReturnType<typeof zSidebar>>

export const zSocial = () => z.record(z.string())

export type ISocial = z.infer<ReturnType<typeof zSocial>>

export const zTheme = () =>
  z.object({
    title: z.string(),
    banner: z.string().optional(),
    baseUrl: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tabs: zTabs().optional(),
    author: zAuthor(),
    social: zSocial().optional(),
    sidebar: zSidebar().optional(),
    analytics: z
      .object({
        plausible: z.string().optional(),
      })
      .optional(),
    comments: z
      .object({
        remark42: zRemark42().optional(),
      })
      .optional(),
    features: z
      .object({
        lazyload: z.boolean().optional(),
      })
      .optional(),
  })

export type ITheme = z.infer<ReturnType<typeof zTheme>>

const config = async (): Promise<NuxtConfig> => {
  const theme = zTheme().parse(
    yaml.safeLoad(fs.readFileSync(path.join(CONTENT_PATH, 'theme.yml'), 'utf8'))
  )

  const srv = await getServer()

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
        { src: '/plugins-async/remark42.js', async: true, type: 'module' },
        { src: '/plugins-async/x-card.js', async: true, type: 'module' },
      ],
    },
    css: [
      '~/styles/app.scss',
      '~/node_modules/highlight.js/styles/night-owl.css',
    ],
    plugins: ['~/plugins/fontawesome.ts'],
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
      '/serverMiddleware': 'http://localhost:5000',
      '/.netlify/functions': 'http://localhost:9000',
      '/plugins-async': 'http://localhost:1234',
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
    env: {
      title: theme.title,
      baseUrl: theme.baseUrl,
      remark42Config: JSON.stringify(theme.comments?.remark42 || null),
      author: JSON.stringify(theme.author),
      social: JSON.stringify(theme.social || {}),
      tabs: JSON.stringify(
        (theme.tabs || []).reduce(
          (prev, c) => ({ ...prev, [c.id]: c.q }),
          {} as Record<string, string>
        )
      ),
      BlogLayout: JSON.stringify({
        banner: theme.banner,
        tabs: theme.tabs,
        sidebar: theme.sidebar,
        tagCloudData: JSON.parse(fs.readFileSync('./build/tag.json', 'utf-8')),
        hasSocial: !!theme.social,
      }),
    },
    hooks: {
      generate: {
        done() {
          if (srv) {
            srv.close()
          }
          process.exit(0)
        },
      },
    },
    // Use crawler by default
    generate: {
      // crawler: false,
      // routes() {
      //   const routes = ['/', '/blog']
      //   const blog = new Set()
      //   const tag = new Map()
      //   const getUrl = ({ path }: { path: string }) => {
      //     return `/post/${path}`
      //   }
      //   Object.entries<{
      //     tag?: string[]
      //     date?: string
      //   }>(rawJson)
      //     .map(([path, { tag, date }]) => ({
      //       path,
      //       tag,
      //       date,
      //     }))
      //     .map((f) => {
      //       const p = {
      //         path: f.path,
      //         date: f.date ? dayjs(f.date).toDate() : undefined,
      //       }
      //       blog.add(p)
      //       routes.push(getUrl(p))
      //       const ts: string[] = f.tag || []
      //       ts.map((t) => {
      //         const ts = tag.get(t) || new Set()
      //         ts.add(p)
      //         tag.set(t, ts)
      //       })
      //     })
      //   Array(Math.ceil(blog.size / 5))
      //     .fill(null)
      //     .map((_, i) => {
      //       if (i > 0) {
      //         routes.push(`/blog/${i + 1}`)
      //       }
      //     })
      //   Array.from(tag).map(([t, ts]) => {
      //     Array(Math.ceil(ts.size / 5))
      //       .fill(null)
      //       .map((_, i) => {
      //         if (i > 0) {
      //           routes.push(`/tag/${t}/${i + 1}`)
      //         } else {
      //           routes.push(`/tag/${t}`)
      //         }
      //       })
      //   })
      //   return routes
      // },
    },
  }
}

export default config
