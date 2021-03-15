/* eslint-disable require-await */
import { Handler } from 'aws-lambda'
import sqlite3 from 'better-sqlite3'

import { parseQ } from '../server/db'

const db = sqlite3('data.db')

export const handler: Handler = (evt, _, cb) => {
  const { q = '', page: _page = '1', limit: _limit = '5' } =
    evt.queryStringParameters || {}
  const limit = parseInt(_limit)
  const page = parseInt(_page)

  cb(null, {
    statusCode: 200,
    body: JSON.stringify(parseQ(db, { q, limit, page })),
  })
}
