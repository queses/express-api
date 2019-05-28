import './core/init-app'
import express from 'express'
import apiRoutes from './core/web/api-routes'
import { logError, logInfo } from './utils/log-utils'
import { appConfig } from './config'

const start = async () => {
  const app = express()
  const host = process.env.HOST || '127.0.0.1'
  const port = parseInt(process.env.PORT || '', 10) || 3007

  app.set('port', port)

  app.use('/api', apiRoutes)
  app.use('/static', express.static(appConfig.staticPath));

  app.listen(port, host)
  logInfo(`App started on ${host}:${port}`)
}

start()
  .catch(logError)
