require('dotenv').config()

const express = require('express')
const apiRoutes = require('./core/web/api-routes')
const { appConfig } = require('./config')
const { logInfo, logError } = require('./utils/log-utils')
const path = require('path')


const start = async () => {
  const app = express()
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3007

  app.set('port', port)

  app.use('/api', apiRoutes)

  // Why api/?
  app.use('/api/static', express.static(appConfig.staticPath));

  app.listen(port, host)
  logInfo(`App started on ${host}:${port}`)
}

start()
  .catch(logError)
