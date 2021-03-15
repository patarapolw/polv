import dayjs from 'dayjs'
import { FastifyPluginAsync } from 'fastify'
import swagger from 'fastify-swagger'
import S from 'jsonschema-definer'

import { ITheme, SEPARATOR, sTheme } from '../db'
import { db } from '../db/sqlite'
import { ISplitOpToken, splitOp } from '../db/tokenize'

const apiRouter: FastifyPluginAsync = async (f) => {
  if (process.env['NODE_ENV'] === 'development') {
    f.register(require('fastify-cors'))
  }

  f.register(swagger, {
    openapi: {},
    routePrefix: '/doc',
    exposeRoute: process.env['NODE_ENV'] === 'development',
  })

  f.addHook<{
    Querystring: Record<string, string | string[]>
  }>('preValidation', async (req) => {
    const { select } = req.query
    if (typeof select === 'string') {
      req.query['select'] = select.split(/,/g)
    }
  })

  f.get(
    '/theme.json',
    {
      schema: {
        operationId: 'getTheme',
        response: {
          200: sTheme.valueOf(),
        },
      },
    },
    async (): Promise<ITheme> => {
      const u = db
        .prepare(
          /* sql */ `
      SELECT theme FROM user
      `
        )
        .get()
      if (!u) {
        throw new Error('UserModel is empty')
      }

      return JSON.parse(u.theme)
    }
  )

  {
    const sResponse = S.object().additionalProperties(S.integer())

    f.get(
      '/tag.json',
      {
        schema: {
          operationId: 'getTag',
          response: {
            200: sResponse.valueOf(),
          },
        },
      },
      async (): Promise<typeof sResponse.type> => {
        db.prepare(
          /* sql */ `
        SELECT tag FROM "entry"
        `
        ).all()

        const entries = db
          .prepare(
            /* sql */ `
        SELECT tag FROM "entry"
        `
          )
          .all()

        return entries
          .flatMap(({ tag = '' }) => tag.split(/ /g).filter((el: string) => el))
          .reduce(
            (prev, c) => ({
              ...prev,
              [c]: (prev[c] || 0) + 1,
            }),
            {} as Record<string, number>
          )
      }
    )
  }

  {
    const sQuerystring = S.shape({
      path: S.string(),
    })

    const sResponse = S.shape({
      title: S.string(),
      date: S.string().format('date-time').optional(),
      image: S.string().optional(),
      tag: S.list(S.string()),
      text: S.string(),
      html: S.string(),
    })

    f.get<{
      Querystring: typeof sQuerystring.type
    }>(
      '/',
      {
        schema: {
          operationId: 'getEntryOne',
          querystring: sQuerystring.valueOf(),
          response: {
            200: sResponse.valueOf(),
          },
        },
      },
      async (req): Promise<typeof sResponse.type> => {
        const { path } = req.query

        const entry = db
          .prepare(
            /* sql */ `
        SELECT title, "date", "image", tag, "text", html
        FROM "entry"
        WHERE "path" = @path
        `
          )
          .get({ path })

        if (!entry) {
          throw { statusCode: 404 }
        }

        return {
          title: entry.title,
          date: entry.date ? new Date(entry.date).toISOString() : undefined,
          image: entry.image || undefined,
          tag: entry.tag.split(/ /g).filter((el: string) => el),
          text: entry.text.split(SEPARATOR)[0],
          html: entry.html,
        }
      }
    )
  }

  {
    const sQuerystring = S.shape({
      q: S.string().optional(),
      page: S.integer(),
      limit: S.integer(),
    })

    const sResponse = S.shape({
      result: S.list(
        S.shape({
          path: S.string(),
          title: S.string(),
          date: S.string().format('date-time').optional(),
          image: S.string().optional(),
          tag: S.list(S.string()),
          html: S.string(),
        })
      ),
      count: S.integer(),
    })

    f.get<{
      Querystring: typeof sQuerystring.type
    }>(
      '/list',
      {
        schema: {
          operationId: 'getEntryList',
          querystring: sQuerystring.valueOf(),
          response: {
            200: sResponse.valueOf(),
          },
        },
      },
      async (req): Promise<typeof sResponse.type> => {
        const { page, limit } = req.query
        let { q = '' } = req.query
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
                let date: Date | null = null

                if (/^\d+(\.\d+)?$/.test(t.v) || /^\.\d+/.test(t.v)) {
                  date = dayjs()
                    .subtract(Math.abs(parseFloat(t.v)), 'days')
                    .toDate()
                } else {
                  let d: dayjs.Dayjs

                  const m = /^(\d+(?:\.\d+)?)?([A-Z]{1,8})$/.exec(t.v)
                  if (m) {
                    d = dayjs().subtract(
                      parseFloat(m[1]!),
                      m[2] as dayjs.OpUnitType
                    )
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
    )
  }
}

export default apiRouter
