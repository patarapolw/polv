import { Handler } from 'aws-lambda'
import lunr, { Index } from 'lunr'

import type { ISearch } from '../server/db/lunr'

export const SEARCH = {
  idx: null as null | Index,
  data: null as null | { [path: string]: ISearch },
  search(q: string): ISearch[] {
    this.data = this.data || require('../generated/raw.min.json')
    const raw = this.data || {}

    let result: ISearch[]

    if (q.trim()) {
      this.idx = this.idx || lunr.Index.load(require('../generated/lunr.json'))
      result = this.idx.search(q).map((r) => raw[r.ref])
    } else {
      result = Object.values(raw)
    }

    const parseDate = (d?: string) => (d ? +new Date(d) : -1)

    return result.sort(
      ({ date: d1 }, { date: d2 }) => parseDate(d2) - parseDate(d1)
    )
  },
}

export const handler: Handler = (evt, _, cb) => {
  const { q = '', page: _page = '1', limit: _limit = '5' } =
    evt.queryStringParameters || {}
  const limit = parseInt(_limit)
  const page = parseInt(_page)

  const rs = SEARCH.search(q)

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      result: rs.slice((page - 1) * limit, page * limit),
      count: rs.length,
    }),
  })
}
