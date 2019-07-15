import { Logger } from '../core'
import * as winston from 'winston'
import { appConfig } from '../../config'

export class WinstonLogger implements Logger {
  logger: winston.Logger

  constructor () {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.prettyPrint(),
      transports: [
        new winston.transports.File({ filename: appConfig.dataPath + '/log/error.log', level: 'error' }),
        new winston.transports.Console()
      ]
    })
  }

  log(message: string): void {
    this.logger.log('info', message, { at: new Date().toLocaleString() })
  }

  error(message: string, trace?: string): void {
    this.logger.log('error', message, { at: new Date().toLocaleString(), trace })
  }

  public warn(message: string): void {
    this.logger.log('warn', message, { at: new Date().toLocaleString() })
  }
}
