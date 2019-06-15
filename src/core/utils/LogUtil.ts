import { EnvUtil } from './EnvUtil'

export class LogUtil {
  static logInfo (...messages: any[]) {
    Reflect.apply(console.log, undefined, messages)
  }

  static logDevInfo (...messages: any[]) {
    if (!EnvUtil.isProd) {
      Reflect.apply(console.log, undefined, messages)
    }
  }

  static logError (...messages: any[]) {
    Reflect.apply(console.error, undefined, messages)
  }
}
