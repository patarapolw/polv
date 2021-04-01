import { Handler } from 'aws-lambda'
import lunr, { Index } from 'lunr'

import data from '../generated/raw.min.json'
import type { ISearch } from '../server/db/lunr'

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

    return result
      .filter(cond)
      .sort(({ date: d1 }, { date: d2 }) => parseDate(d2) - parseDate(d1))
  },
}

export const handler: Handler = (evt, _, cb) => {
  const { q: _q = '', page: _page = '1', limit: _limit = '5' } =
    evt.queryStringParameters || {}
  const limit = parseInt(_limit)
  const page = parseInt(_page)

  const tags: string[] = []
  const q = _q.replace(
    /(^| )tag:([^ ]+)( |$)/g,
    (_p0: any, _p1: any, tag: string, _p3: any) => {
      tags.push(tag)
      return ' '
    }
  )

  const rs = SEARCH.search(
    q,
    tags.length ? ({ tag }) => tag.some((t) => tags.includes(t)) : () => true
  )

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      result: rs.slice((page - 1) * limit, page * limit),
      count: rs.length,
    }),
  })
}
