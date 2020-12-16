import express from 'express'
import lunr, { Index } from 'lunr'
import * as z from 'zod'

import idxJson from '../build/idx.json'
import _rawJson from '../build/raw.json'
import { IPostSerialized } from './db'

const app = express()
let idx: Index
const rawJson: Record<string, IPostSerialized> = _rawJson
const allData: IPostSerialized[] = Object.values(rawJson).sort(
  ({ date: a }, { date: b }) => {
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
  }
)

app.get('/', (req, res) => {
  const { path } = z
    .object({
      path: z.string(),
    })
    .parse(req.query)

  const r = rawJson[path]
  if (!r) {
    res.sendStatus(404)
    return
  }

  res.json(r)
})

app.get('/q', (req, res) => {
  const { q, tag, page: _page = '1' } = z
    .object({
      q: z.string().optional(),
      tag: z.string().optional(),
      page: z
        .string()
        .refine((s) => /^\d+$/.test(s))
        .optional(),
    })
    .parse(req.query)

  const perPage = 5
  const offset = (parseInt(_page) - 1) * perPage

  let currentData: IPostSerialized[]

  if (q) {
    idx = idx || lunr.Index.load(idxJson)

    currentData = idx.search(q).map(({ ref }) => {
      return rawJson[ref]
    })
  } else {
    currentData = allData
  }

  if (tag) {
    currentData = allData.filter((d) => d.tag && d.tag.includes(tag))
  }

  const count = currentData.length
  const result = currentData.slice(offset, offset + 5)

  res.json({
    count,
    result,
  })
})

app.use((err: Error, _: express.Request, res: express.Response) => {
  // eslint-disable-next-line no-console
  console.error(err.stack)
  res.status(500).send(err)
})

export default app
