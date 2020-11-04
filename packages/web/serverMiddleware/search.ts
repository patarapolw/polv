import { Request, Response } from 'express'

import lunr, { Index } from 'lunr'

import idxJson from '../build/idx.json'
import rawJson from '../build/raw.json'

let idx: Index

const router = (req: Request, res: Response) => {
  const { q, tag, offset } = req.query

  let allData

  if (q) {
    idx = idx || lunr.Index.load(idxJson)

    allData = idx.search(q as string).map(({ ref }) => {
      return rawJson[ref]
    })
  } else {
    allData = Object.values(rawJson)
  }

  if (tag) {
    allData = allData.filter((d) => d.tag && d.tag.includes(tag))
  }

  const count = allData.length
  const result = allData
    .sort(({ date: a }, { date: b }) => {
      return a ? (b ? b.localeCompare(a) : a) : b
    })
    .slice(
      parseInt((offset as string) || '0'),
      parseInt((offset as string) || '0') + 5
    )

  res.json({
    count,
    result,
  })
}

export default router
