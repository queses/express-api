import { AppLogger } from '../log/AppLogger'
import { EnvUtil } from '../utils/EnvUtil'
import { WebErrorResponse } from '../core'

export class WebErrorHandler {
  static onNotFound (): WebErrorResponse {
    return { code: 404, status: 'Not found' }
  }

  static onError <E extends Error> (error: E): WebErrorResponse {
    AppLogger.error(error.message, error.stack)

    const res: WebErrorResponse = { code: 500, status: 'Internal Server Error' }

    if (!EnvUtil.isProd) {
      res.message = error.message
      res.trace = error.stack
    }

    return res
  }
}
