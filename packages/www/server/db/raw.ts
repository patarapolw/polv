import fs from 'fs'

import S from 'jsonschema-definer'

export const sTheme = S.shape({
  title: S.string(),
  banner: S.string(),
  baseUrl: S.string(),
  description: S.string().optional(),
  favicon: S.string(),
  keywords: S.list(S.string()).optional(),
  tabs: S.list(
    S.shape({
      name: S.string(),
      id: S.string(),
      q: S.string(),
    })
  ).optional(),
  author: S.shape({
    url: S.string().optional(),
    email: S.string().optional(),
    name: S.string(),
    image: S.string(),
  }).additionalProperties(true),
  social: S.shape({
    facebook: S.string().optional(),
    twitter: S.string().optional(),
    reddit: S.string().optional(),
    quora: S.string().optional(),
    github: S.string().optional(),
    linkedin: S.string().optional(),
  }).additionalProperties(true),
  sidebar: S.shape({
    tagCloud: S.boolean().optional(),
    twitter: S.string().optional(),
  }).optional(),
  analytics: S.shape({
    plausible: S.string().optional(),
  }).optional(),
}).additionalProperties(true)

export type ITheme = typeof sTheme.type

export const THEME = {
  data: null as ITheme | null,
  get(): ITheme {
    this.data =
      this.data ||
      sTheme.ensure(
        JSON.parse(fs.readFileSync('./generated/theme.json', 'utf-8'))
      )
    return this.data
  },
  set(t: ITheme) {
    this.data = t
    fs.writeFileSync('./generated/theme.json', JSON.stringify(t))
  },
}

// From https://randomkeygen.com/. Make sure it is unsearchable.
export const SEPARATOR = '<!-- cUVdnfHD4e0kM4v4VPiCRC4HV26PuPvZ -->'

export const sRaw = S.shape({
  category: S.list(S.string()),
  title: S.string(),
  date: S.string().format('date-time').optional(),
  image: S.string().optional(),
  tag: S.list(S.string()),
  text: S.string(),
  html: S.string(),
})

export type IRaw = typeof sRaw.type

export const RAW = {
  data: null as null | { [path: string]: IRaw },
  get(): { [path: string]: IRaw } {
    this.data =
      this.data ||
      S.object()
        .additionalProperties(sRaw)
        .ensure(JSON.parse(fs.readFileSync('./generated/raw.json', 'utf-8')))
    return this.data
  },
  set(t: { [path: string]: IRaw }) {
    this.data = t
    fs.writeFileSync(
      './generated/raw.json',
      JSON.stringify(S.object().additionalProperties(sRaw).ensure(t))
    )
  },
}
