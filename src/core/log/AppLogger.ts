import { Logger } from '../core'
import { Container } from 'typedi'
import { LoggerTkn } from '../ioc'
import { EnvUtil } from '../utils/EnvUtil'

export class AppLogger {
  static log (message: string) {
    this.logger.log(message)
  }

  static dev (message: string) {
    if (!EnvUtil.isProd) {
      this.log(message)
    }
  }

  static error (message: string, trace?: string) {
    this.logger.error(message, trace)
  }

  static warn (message: string) {
    this.logger.warn(message)
  }

  private static _logger: Logger

  private static get logger () {
    if (!this._logger) {
      this._logger = Container.get(LoggerTkn)
    }

    return this._logger
  }
}
