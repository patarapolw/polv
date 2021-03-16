import fs from 'fs'

import S from 'jsonschema-definer'

import { IRaw, SEPARATOR } from './raw'

export const sSearch = S.shape({
  path: S.string(),
  category: S.list(S.string()),
  title: S.string(),
  date: S.string().format('date-time').optional(),
  image: S.string().optional(),
  tag: S.list(S.string()),
  text: S.string(),
  html: S.string(),
})

export type ISearch = typeof sSearch.type

export const SEARCH = {
  set(t: { [path: string]: IRaw }) {
    const raw: { [path: string]: Omit<ISearch, 'path'> } = {}
    Object.entries(t).forEach(([path, entry]) => {
      const p = { ...entry, html: entry.html.split(SEPARATOR)[0] }
      raw[path] = p
    })

    fs.writeFileSync('./generated/raw.min.json', JSON.stringify(raw))
  },
}
