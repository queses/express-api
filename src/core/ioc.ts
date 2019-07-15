import { initImageIoc } from '../image/image-ioc'
import { Service, Token } from 'typedi'
import { Logger } from './core'
import { WinstonLogger } from './log/WinstonLogger'

export const LoggerTkn = new Token<Logger>('Logger')

export const initContainer = () => {
  initCoreIoc()
  initImageIoc()
}

const initCoreIoc = () => {
  Service(LoggerTkn)(WinstonLogger)
}
