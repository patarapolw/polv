import type { Database } from 'better-sqlite3'
import dayjs from 'dayjs'
import S from 'jsonschema-definer'

import { ISplitOpToken, splitOp } from './tokenize'

export const sTheme = S.shape({
  title: S.string(),
  banner: S.string(),
  baseUrl: S.string(),
  description: S.string().optional(),
  favicon: S.string(),
  keywords: S.list(S.string()).optional(),
  tabs: S.list(
    S.shape({
      name: S.string(),
      id: S.string(),
      q: S.string(),
    })
  ).optional(),
  author: S.shape({
    url: S.string().optional(),
    email: S.string().optional(),
    name: S.string(),
    image: S.string(),
  }).additionalProperties(true),
  social: S.shape({
    facebook: S.string().optional(),
    twitter: S.string().optional(),
    reddit: S.string().optional(),
    quora: S.string().optional(),
    github: S.string().optional(),
    linkedin: S.string().optional(),
  }).additionalProperties(true),
  sidebar: S.shape({
    tagCloud: S.boolean().optional(),
    twitter: S.string().optional(),
  }).optional(),
  analytics: S.shape({
    plausible: S.string().optional(),
  }).optional(),
  comment: S.shape({
    remark42: S.shape({
      host: S.string(),
      siteId: S.string(),
      locale: S.string().optional(),
    }).optional(),
  }).optional(),
}).additionalProperties(true)

export type ITheme = typeof sTheme.type

// From https://randomkeygen.com/. Make sure it is unsearchable.
export const SEPARATOR = '<!-- cUVdnfHD4e0kM4v4VPiCRC4HV26PuPvZ -->'

export function parseQ(
  db: Database,
  query: {
    page: number
    limit: number
    q?: string
  }
) {
  const { page = 1, limit = 5 } = query
  let { q = '' } = query
  q = q.trim()

  let cond = ''

  const params = {
    map: new Map<number, string | number>(),
    set(v: string | number) {
      this.map.set(this.map.size, v)
      return '$' + (this.map.size - 1)
    },
  }

  if (q) {
    const $and: string[] = []
    const $or: string[] = []
    const $nor: string[] = []

    const segParse = (t: ISplitOpToken): string => {
      switch (t.k) {
        case 'tag':
          return /* sql */ `"entry" MATCH ${params.set(
            `tag:"${t.v.replace(/"/g, '""')}"`
          )}`
        case 'title':
          return `"entry" MATCH ${params.set(
            `title:"${t.v.replace(/"/g, '""')}"`
          )}`
        case 'path':
          return `"entry" MATCH ${params.set(
            `path:"${t.v.replace(/"/g, '""')}"`
          )}`
        case 'content':
          return `"entry" MATCH ${params.set(
            `text:"${t.v.replace(/"/g, '""')}"`
          )}`
        case 'date':
          // eslint-disable-next-line no-case-declarations
          let date: Date | null = null

          if (/^\d+(\.\d+)?$/.test(t.v) || /^\.\d+/.test(t.v)) {
            date = dayjs()
              .subtract(Math.abs(parseFloat(t.v)), 'days')
              .toDate()
          } else {
            let d: dayjs.Dayjs

            const m = /^(\d+(?:\.\d+)?)?([A-Z]{1,8})$/.exec(t.v)
            if (m) {
              d = dayjs().subtract(parseFloat(m[1]!), m[2] as dayjs.OpUnitType)
            } else {
              d = dayjs(t.v)
            }

            if (d.isValid()) {
              date = d.toDate()
            }
          }

          if (!date) {
            return /* sql */ `FALSE`
          }

          switch (t.op) {
            case '>':
              return /* sql */ `"date" > ${params.set(+date)}`
            case '<':
              return /* sql */ `"date" < ${params.set(+date)}`
          }

          return /* sql */ `"date" > ${params.set(+date)}`
      }

      return `"entry" MATCH ${params.set(
        `(tag:"${t.v.replace(/"/g, '""')}" OR text:"${t.v.replace(
          /"/g,
          '""'
        )}" OR title:"${t.v.replace(/"/g, '""')}")`
      )}`
    }

    // eslint-disable-next-line array-callback-return
    splitOp(q).map((t) => {
      switch (t.prefix) {
        case '-':
          $nor.push(segParse(t))
          break
        case '?':
          $or.push(segParse(t))
          break
        default:
          $and.push(segParse(t))
      }
    })

    if ($or.length) {
      $and.push(`(${$or.join(' OR ')})`)
    }

    if ($nor.length) {
      $and.push(`NOT (${$or.join(' AND ')})`)
    }

    cond = $and.length ? $and.join(' AND ') : 'FALSE'
    cond = '"date" IS NOT NULL AND ' + cond
  }

  if (!cond) {
    cond = '"date" IS NOT NULL'
  }

  const rCount = db
    .prepare(
      /* sql */ `
        SELECT COUNT("path") AS count
        FROM "entry"
        WHERE ${cond}
        `
    )
    .get({ ...params.map })

  if (!rCount) {
    return {
      result: [],
      count: 0,
    }
  }

  const rResult = db
    .prepare(
      /* sql */ `
        SELECT "path", title, "date", "image", tag, html
        FROM "entry"
        WHERE ${cond}
        ORDER BY "date" DESC
        LIMIT ${limit} OFFSET ${(page - 1) * limit}
        `
    )
    .all({ ...params.map })

  return {
    result: rResult.map((entry) => ({
      path: entry.path,
      title: entry.title,
      date: entry.date ? new Date(entry.date).toISOString() : undefined,
      image: entry.image || undefined,
      tag: entry.tag.split(/ /g).filter((el: string) => el),
      html: entry.html.split(SEPARATOR)[0],
    })),
    count: rCount.count,
  }
}
