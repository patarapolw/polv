import fs from 'fs'
import lunr, { Index } from 'lunr'

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
  idx: null as null | Index,
  data: null as null | { [path: string]: ISearch },
  search(q: string, cond: (r: ISearch) => boolean): ISearch[] {
    this.data = this.data || {}
    const raw = this.data
    this.idx =
      this.idx ||
      lunr(function () {
        this.ref('path')
        this.field('title')
        this.field('tag')
        this.field('text')
        this.field('category')

        const now = new Date()

        Object.entries(
          require('../../generated/raw.min.json') as {
            [path: string]: Omit<ISearch, 'path'>
          }
        )
          .filter(([, { date }]) => !date || new Date(date) < now)
          .forEach(([path, entry]) => {
            const p = { path, ...entry }
            raw[path] = p
            this.add(p)
          })
      })

    let result: ISearch[]
    if (q.trim()) {
      result = this.idx.search(q).map((r) => raw[r.ref])
    } else {
      result = Object.values(this.data)
    }

    const parseDate = (d?: string) => (d ? +new Date(d) : -1)

    return result
      .filter(cond)
      .sort(({ date: d1 }, { date: d2 }) => parseDate(d2) - parseDate(d1))
  },
  set(t: { [path: string]: IRaw }) {
    const raw: { [path: string]: Omit<ISearch, 'path'> } = {}
    Object.entries(t).forEach(([path, entry]) => {
      const p = { ...entry, html: entry.html.split(SEPARATOR)[0] }
      raw[path] = p
    })

    fs.writeFileSync('./generated/raw.min.json', JSON.stringify(raw))
  },
}
