import './core/init-app'
import { logError } from './utils/log-utils'
import { initContainer } from './core/ioc'
import { startFastify } from './start-fastify'

initContainer()
startFastify().catch(logError)
