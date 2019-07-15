import fastify from 'fastify'
import { apiRoutes } from './core/fastify/api-routes'
import { AppLogger } from './core/log/AppLogger'
import { WebErrorHandler } from './core/web/WebErrorHandler'

export const startFastify = async () => {
  const app = fastify()
  const host = process.env.HOST || '127.0.0.1'
  const port = parseInt(process.env.PORT || '', 10) || 3007

  app.register(apiRoutes)

  app.setNotFoundHandler((request, reply) => {
    const res = WebErrorHandler.onNotFound()
    reply.status(res.code)
    reply.send(res)
  })

  app.setErrorHandler(async (error, req, reply) => {
    const res = WebErrorHandler.onError(error)
    reply.status(res.code)
    reply.send(res)
  })

  try {
    await app.listen(port, host)
  } catch (err) {
    AppLogger.error(err)
    process.exit(1)
  }

  AppLogger.log(`App started on ${host}:${port}`)
}
