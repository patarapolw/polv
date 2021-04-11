/* eslint-disable no-throw-literal */
/* eslint-disable require-await */
import { FastifyPluginAsync } from 'fastify'
import swagger from 'fastify-swagger'
import S from 'jsonschema-definer'
import { SEARCH } from '../db/lunr'

import { RAW, SEPARATOR } from '../db/raw'

const apiRouter: FastifyPluginAsync = async (f) => {
  if (process.env.NODE_ENV === 'development') {
    f.register(require('fastify-cors'))
  }

  f.register(swagger, {
    openapi: {},
    routePrefix: '/doc',
    exposeRoute: process.env.NODE_ENV === 'development',
  })

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

        const entry = RAW.get()[path]

        if (!entry) {
          throw { statusCode: 404 }
        }

        return {
          title: entry.title,
          date: entry.date ? new Date(entry.date).toISOString() : undefined,
          image: entry.image || undefined,
          tag: entry.tag,
          text: entry.text.split(SEPARATOR)[0],
          html: entry.html,
        }
      }
    )
  }

  {
    f.get(
      '/q',
      {
        schema: {
          operationId: 'getEntryList',
        },
      },
      async () => {
        const rs = SEARCH.search('', () => true)
        const page = 1
        const limit = 5

        return {
          result: rs.slice((page - 1) * limit, page * limit),
          count: rs.length,
        }
      }
    )
  }
}

export default apiRouter
