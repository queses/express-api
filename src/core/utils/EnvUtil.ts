export class EnvUtil {
  static parseBoolean (value: string | undefined) {
    return (value !== '0' && value !== 'false')
  }

  static parseInt (value: string | undefined) {
    return parseInt(value || '', 10)
  }

  static get isProd () {
    return  process.env.NODE_ENV === 'production'
  }
}
