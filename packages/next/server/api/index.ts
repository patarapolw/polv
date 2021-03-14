/* eslint-disable require-await */
import { FastifyPluginAsync } from 'fastify'

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
}

export default apiRouter
