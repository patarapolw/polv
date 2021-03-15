/* eslint-disable no-throw-literal */
/* eslint-disable require-await */
import { FastifyPluginAsync } from 'fastify'
import swagger from 'fastify-swagger'
import S from 'jsonschema-definer'

import { ITheme, SEPARATOR, parseQ, sTheme } from '../db'
import { db } from '../db/sqlite'

const apiRouter: FastifyPluginAsync = async (f) => {
  if (process.env.NODE_ENV === 'development') {
    f.register(require('fastify-cors'))
  }

  f.register(swagger, {
    openapi: {},
    routePrefix: '/doc',
    exposeRoute: process.env.NODE_ENV === 'development',
  })

  f.addHook<{
    Querystring: Record<string, string | string[]>
  }>('preValidation', async (req) => {
    const { select } = req.query
    if (typeof select === 'string') {
      req.query.select = select.split(/,/g)
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
        const { page, limit, q } = req.query

        return parseQ(db, {
          q,
          limit,
          page,
        })
      }
    )
  }
}

export default apiRouter
