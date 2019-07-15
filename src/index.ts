import './core/init-app'
import { initContainer } from './core/ioc'
import { startFastify } from './start-fastify'
import { AppLogger } from './core/log/AppLogger'

initContainer()
startFastify().catch(AppLogger.error)
