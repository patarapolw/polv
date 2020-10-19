import fs from 'fs'
import path from 'path'

import { NuxtConfig } from '@nuxt/types'
import dayjs from 'dayjs'
import yaml from 'js-yaml'
import * as z from 'zod'

import rawJson from './build/raw.json'
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
  })

export type IAuthor = z.infer<ReturnType<typeof zAuthor>>

export const zTabs = () =>
  z.array(
    z.object({
      name: z.string(),
      to: z.string().optional(),
      href: z.string().optional(),
    })
  )

export type ITabs = z.infer<ReturnType<typeof zTabs>>

export const zSidebar = () =>
  z.object({
    twitter: z.string().optional(),
    tagCloud: z
      .object({
        excluded: z.array(z.string()).optional(),
      })
      .optional(),
  })

export type ISidebar = z.infer<ReturnType<typeof zSidebar>>

export const zSocial = () =>
  z.object({
    twitter: z.string().optional(),
    reddit: z.string().optional(),
    quora: z.string().optional(),
    github: z.string().optional(),
  })

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
      ],
    },
    css: ['~/styles/app.scss', 'highlight.js/styles/default.css'],
    plugins: [
      '~/plugins/fontawesome.ts',
      ...(theme.comments?.remark42 ? ['~/plugins/remark42.client.js'] : []),
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
    serverMiddleware: [
      { path: '/serverMiddleware/post', handler: '~/serverMiddleware/post.ts' },
      {
        path: '/serverMiddleware/search',
        handler: '~/serverMiddleware/search.ts',
      },
    ],
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
      BlogLayout: JSON.stringify({
        banner: theme.banner,
        tabs: theme.tabs,
        sidebar: theme.sidebar,
        tagCloudData: JSON.parse(fs.readFileSync('./build/tag.json', 'utf-8')),
        hasSocial: !!theme.social,
      }),
    },
    generate: {
      crawler: false,
      routes() {
        const routes = ['/', '/blog']

        const blog = new Set()
        const tag = new Map()

        const getUrl = ({ path }: { path: string }) => {
          return `/post/${path}`
        }

        Object.entries<{
          tag?: string[]
          date?: string
        }>(rawJson)
          .map(([path, { tag, date }]) => ({
            path,
            tag,
            date,
          }))
          .map((f) => {
            const p = {
              path: f.path,
              date: f.date ? dayjs(f.date).toDate() : undefined,
            }
            blog.add(p)
            routes.push(getUrl(p))

            const ts: string[] = f.tag || []

            ts.map((t) => {
              const ts = tag.get(t) || new Set()
              ts.add(p)
              tag.set(t, ts)
            })
          })

        Array(Math.ceil(blog.size / 5))
          .fill(null)
          .map((_, i) => {
            if (i > 0) {
              routes.push(`/blog/${i + 1}`)
            }
          })

        Array.from(tag).map(([t, ts]) => {
          Array(Math.ceil(ts.size / 5))
            .fill(null)
            .map((_, i) => {
              if (i > 0) {
                routes.push(`/tag/${t}/${i + 1}`)
              } else {
                routes.push(`/tag/${t}`)
              }
            })
        })

        return routes
      },
    },
  }
}

export default config
