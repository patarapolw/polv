import { Request, Response, NextFunction } from 'express'

import rawJson from '../build/raw.json'

const router = (req: Request, res: Response, next: NextFunction) => {
  const { path } = req.query

  if (!path) {
    next(new Error('slug must be provided'))
    return
  }

  const r = rawJson[path as string] || {}
  res.json(r)
}

export default router
