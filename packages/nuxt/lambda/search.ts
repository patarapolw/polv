import { Handler } from 'aws-lambda'
import lunr, { Index } from 'lunr'

import idxJson from '../build/idx.json'
import _rawJson from '../build/raw.json'
import { IPostSerialized } from '../server/db'

let idx: Index
const rawJson: Record<string, IPostSerialized> = _rawJson
let allData: IPostSerialized[]

export const handler: Handler = async (evt) => {
  const { q = '', tag, page: _page = '1' } = evt.queryStringParameters || {}
  const perPage = 5
  const offset = (parseInt(_page) - 1) * perPage

  idx = idx || lunr.Index.load(idxJson)
  allData =
    allData ||
    Object.values(rawJson).sort(({ date: a }, { date: b }) => {
      if (typeof b === 'undefined') {
        if (typeof a === 'undefined') {
          return 0
        }

        return -1
      }
      if (typeof a === 'undefined') {
        return 1
      }

      return b - a
    })

  let currentData = idx.search(q).map(({ ref }) => {
    const { date, image, title, excerptHtml, tag, path } = rawJson[ref]
    return {
      path,
      date,
      image,
      title,
      excerptHtml,
      tag,
    }
  })

  if (tag) {
    currentData = allData
      .filter(({ tag }) => tag && tag.includes(tag))
      .map(({ path, date, image, title, excerptHtml, tag }) => ({
        path,
        date,
        image,
        title,
        excerptHtml,
        tag,
      }))
  }

  const count = currentData.length
  const result = currentData.slice(offset, offset + perPage)

  return {
    statusCode: 200,
    body: JSON.stringify({
      count,
      result,
    }),
  }
}
