import './core/init-app'
import { initContainer } from './core/ioc'
import { startFastify } from './start-fastify'
import { LogUtil } from './core/utils/LogUtil'

initContainer()
startFastify().catch(LogUtil.logError)
