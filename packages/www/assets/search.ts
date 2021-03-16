import data from '~/generated/raw.min.json'
import type { ISearch } from '~/server/db/lunr'
import lunr, { Index } from 'lunr'

export const SEARCH = {
  idx: null as null | Index,
  data: null as null | { [path: string]: ISearch },
  search(q = ''): ISearch[] {
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

        Object.entries(data as { [path: string]: Omit<ISearch, 'path'> })
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

    return result.sort(
      ({ date: d1 }, { date: d2 }) => parseDate(d2) - parseDate(d1)
    )
  },
}
