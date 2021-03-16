import fs from 'fs'

import S from 'jsonschema-definer'
import lunr from 'lunr'

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
  idx: null as null | lunr.Index,
  data: null as null | { [path: string]: ISearch },
  search(q: string): ISearch[] {
    this.data =
      this.data ||
      S.object()
        .additionalProperties(sSearch)
        .ensure(
          JSON.parse(fs.readFileSync('./generated/raw.min.json', 'utf-8'))
        )
    const raw = this.data

    let result: ISearch[]

    if (q.trim()) {
      this.idx =
        this.idx ||
        lunr.Index.load(
          JSON.parse(fs.readFileSync('./generated/lunr.json', 'utf-8'))
        )
      try {
        result = this.idx.search(q).map((r) => raw[r.ref])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        result = []
      }
    } else {
      result = Object.values(raw)
    }

    const parseDate = (d?: string) => (d ? +new Date(d) : -1)

    return result.sort(
      ({ date: d1 }, { date: d2 }) => parseDate(d2) - parseDate(d1)
    )
  },
  set(t: { [path: string]: IRaw }) {
    this.data = {}
    const raw = this.data
    this.idx = lunr(function () {
      this.ref('path')
      this.field('title')
      this.field('tag')
      this.field('text')
      this.field('category')

      Object.entries(t).forEach(([path, entry]) => {
        const p = { path, ...entry, html: entry.html.split(SEPARATOR)[0] }
        raw[path] = p
        this.add(p)
      })
    })

    fs.writeFileSync('./generated/lunr.json', JSON.stringify(this.idx))
    fs.writeFileSync('./generated/raw.min.json', JSON.stringify(raw))
  },
}
