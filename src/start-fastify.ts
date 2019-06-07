import fastify from 'fastify'
import { logError, logInfo } from './utils/log-utils'
import { appConfig } from './config'
import { apiRoutes } from './core/fastify/api-routes'

export const startFastify = async () => {
  const app = fastify()
  const host = process.env.HOST || '127.0.0.1'
  const port = parseInt(process.env.PORT || '', 10) || 3007

  app.register(apiRoutes)

  try {
    await app.listen(port, host)
  } catch (err) {
    logError(err)
    process.exit(1)
  }

  logInfo(`App started on ${host}:${port}`)
}
