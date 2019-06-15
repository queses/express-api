import fastify from 'fastify'
import { apiRoutes } from './core/fastify/api-routes'
import { LogUtil } from './core/utils/LogUtil'

export const startFastify = async () => {
  const app = fastify()
  const host = process.env.HOST || '127.0.0.1'
  const port = parseInt(process.env.PORT || '', 10) || 3007

  app.register(apiRoutes)

  try {
    await app.listen(port, host)
  } catch (err) {
    LogUtil.logError(err)
    process.exit(1)
  }

  LogUtil.logInfo(`App started on ${host}:${port}`)
}
