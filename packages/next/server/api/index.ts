/* eslint-disable no-throw-literal */
/* eslint-disable require-await */
import { FastifyPluginAsync } from 'fastify'
import S from 'jsonschema-definer'

import { EntryModel, ITheme, UserModel, sTheme } from '../db/mongo'

const apiRouter: FastifyPluginAsync = async (f) => {
  if (process.env.NODE_ENV === 'development') {
    f.register(require('fastify-cors'))
  }

  f.addHook<{
    Querystring: Record<string, string | string[]>
  }>('preValidation', async (req) => {
    if (typeof req.query.select === 'string') {
      req.query.select = req.query.select.split(/,/g)
    }
  })

  f.get(
    '/theme.json',
    {
      schema: {
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
      html: S.string(),
    })

    f.get<{
      Querystring: typeof sQuerystring.type
    }>(
      '/',
      {
        schema: {
          querystring: sQuerystring.valueOf(),
          response: {
            200: sResponse.valueOf(),
          },
        },
      },
      async (req) => {
        const { path } = req.query

        const entry = await EntryModel.findOne({ path }).select({
          _id: 0,
          path: 0,
          text: 0,
          markdown: 0,
        })

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
          text: S.string(),
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
          {
            $facet: {
              result: [
                { $skip: (page - 1) * limit },
                { $limit: limit },
                {
                  $project: {
                    _id: 0,
                    path: 1,
                    title: 1,
                    date: 1,
                    image: 1,
                    text: {
                      $arrayElemAt: [
                        { $split: ['$text', '<!-- excerpt -->'] },
                        0,
                      ],
                    },
                    html: {
                      $arrayElemAt: [
                        { $split: ['$html', '<!-- excerpt -->'] },
                        0,
                      ],
                    },
                  },
                },
              ],
              count: [{ $count: 'count' }],
            },
          },
        ]

        if (q) {
          cond = q
          aggPipelines.unshift(cond)
        }

        const [r] = await EntryModel.aggregate(aggPipelines)
        if (!r) {
          return {
            result: [],
            count: 0,
          }
        }

        return { result: r.result, count: r.count[0] }
      }
    )
  }
}

export default apiRouter
