export class LangUtil {
  static getRaceTimeout (timeoutMs: number, messageOrErrorCb: (() => Error) | string) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(
        () => {
          clearTimeout(id)
          reject((typeof messageOrErrorCb === 'function')
            ? messageOrErrorCb()
            : new Error(messageOrErrorCb)
          )
        },
        timeoutMs
      )
    })
  }
}
