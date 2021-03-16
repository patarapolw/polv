import type { ISearch } from '~/server/db/lunr'
import type { Index } from 'lunr'

export const SEARCH = {
  idx: null as null | Index,
  data: null as null | { [path: string]: ISearch },
  async search(q: string): Promise<ISearch[]> {
    this.data = this.data || ((await import('~/generated/raw.min.json')) as any)
    const raw = this.data || {}

    let result: ISearch[]

    if (q.trim()) {
      const lunr = (await import('lunr')).default

      this.idx =
        this.idx || lunr.Index.load(await import('~/generated/lunr.json'))
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
