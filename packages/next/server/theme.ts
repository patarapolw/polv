import * as z from 'zod'

import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

export const THEME_FILENAME = 'theme.yml'

export const zTheme = z
  .object({
    title: z.string(),
    banner: z.string(),
    baseUrl: z.string(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    tabs: z
      .array(
        z.object({
          name: z.string(),
          id: z.string(),
          q: z.string()
        })
      )
      .optional(),
    author: z
      .object({
        url: z.string().optional(),
        email: z.string().optional(),
        name: z.string(),
        image: z.string()
      })
      .nonstrict(),
    social: z
      .object({
        facebook: z.string().optional(),
        twitter: z.string().optional(),
        reddit: z.string().optional(),
        quora: z.string().optional(),
        github: z.string().optional(),
        linkedin: z.string().optional()
      })
      .nonstrict(),
    sidebar: z
      .object({
        tagCloud: z.boolean().optional(),
        twitter: z.string().optional()
      })
      .optional(),
    analytics: z
      .object({
        plausible: z.string().optional()
      })
      .optional(),
    comment: z
      .object({
        remark42: z
          .object({
            host: z.string(),
            siteId: z.string(),
            locale: z.string().optional()
          })
          .optional()
      })
      .optional()
  })
  .nonstrict()

export type ITheme = z.infer<typeof zTheme>

export function getTheme () {
  return zTheme.parse(
    yaml.safeLoad(fs.readFileSync(path.join('build', THEME_FILENAME), 'utf-8'))
  )
}
