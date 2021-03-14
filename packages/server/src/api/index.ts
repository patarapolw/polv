import dayjs from 'dayjs'
import escapeStringRegexp from 'escape-string-regexp'
import { FastifyPluginAsync } from 'fastify'
import swagger from 'fastify-swagger'
import S from 'jsonschema-definer'

import { EntryModel, ITheme, SEPARATOR, UserModel, sTheme } from '../db/mongo'
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
      const u = await UserModel.findOne()
      if (!u) {
        throw new Error('UserModel is empty')
      }

      return u.theme
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
        const entries = await EntryModel.find().select({
          _id: 0,
          tag: 1,
        })

        return entries
          .flatMap(({ tag = [] }) => tag)
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
      async (req) => {
        const { path } = req.query

        const [entry] = await EntryModel.aggregate([
          {
            $match: { path },
          },
          { $limit: 1 },
          {
            $project: {
              _id: 0,
              title: 1,
              date: 1,
              image: 1,
              tag: 1,
              text: {
                $arrayElemAt: [{ $split: ['$text', SEPARATOR] }, 0],
              },
              html: 1,
            },
          },
        ])

        if (!entry) {
          throw { statusCode: 404 }
        }

        return entry
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

        let cond: any = null
        const aggPipelines: any[] = [
          { $match: { date: { $exists: true } } },
          {
            $facet: {
              result: [
                { $sort: { date: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                  $project: {
                    _id: 0,
                    path: 1,
                    title: 1,
                    date: 1,
                    image: 1,
                    tag: 1,
                    html: {
                      $arrayElemAt: [{ $split: ['$html', SEPARATOR] }, 0],
                    },
                  },
                },
              ],
              count: [{ $count: 'count' }],
            },
          },
        ]

        if (q) {
          const $and: any[] = []
          const $or: any[] = []
          const $nor: any[] = []

          const segParse = (t: ISplitOpToken) => {
            switch (t.k) {
              case 'tag':
                return { tag: t.v }
              case 'title':
                return { title: { $regex: escapeStringRegexp(t.v) } }
              case 'path':
                return { path: { $regex: escapeStringRegexp(t.v) } }
              case 'content':
                return { $text: { $search: t.v } }
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
                  return { [Math.random()]: 1 }
                }

                switch (t.op) {
                  case '>':
                    return { date: { $gt: date } }
                  case '<':
                    return { date: { $lt: date } }
                }

                return { date: { $gt: date } }
            }

            return { $or: [{ tag: t.v }, { $text: { $search: t.v } }] }
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
            $and.push({ $or })
          }

          if ($nor.length) {
            $and.push({ $nor })
          }

          cond = $and.length ? { $and } : {}
          aggPipelines.unshift({ $match: cond })
        }

        const [r] = await EntryModel.aggregate(aggPipelines)
        if (!r) {
          return {
            result: [],
            count: 0,
          }
        }

        return {
          result: r.result,
          count: r.count[0].count,
        }
      }
    )
  }
}

export default apiRouter
