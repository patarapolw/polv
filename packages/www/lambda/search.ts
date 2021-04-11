import { Handler } from 'aws-lambda'
import { SEARCH } from '../server/db/lunr'

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
