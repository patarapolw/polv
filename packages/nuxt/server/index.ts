import express from 'express'
import morgan from 'morgan'
import * as z from 'zod'

import { Database } from './db'

const app = express()
app.use(morgan('dev'))

const db = new Database({ readonly: true })

app.get('/', (req, res) => {
  const { path } = z
    .object({
      path: z.string(),
    })
    .parse(req.query)

  const r = db.get(path)
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

  if (q) {
    res.json(
      db.q(q, {
        offset,
        limit: perPage,
        tag,
      })
    )
    return
  }

  res.json(
    db.by({
      offset,
      limit: perPage,
      tag,
    })
  )
})

app.use((err: Error, _: express.Request, res: express.Response) => {
  // eslint-disable-next-line no-console
  console.error(err.stack)
  res.status(500).send(err)
})

export default app
