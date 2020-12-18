import type { NextApiRequest, NextApiResponse } from 'next'

import { doSearch } from '~/server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const r = await doSearch({
    q: req.query.q as string,
    tag: req.query.tag as string,
    page: parseInt(req.query.page as string) || 1
  })

  res.json(r)
}
