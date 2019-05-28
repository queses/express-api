const { getIsProd } = require('./env-utils')

module.exports.logInfo = (...messages) => {
  Reflect.apply(console.log, undefined, messages)
}

module.exports.logDevInfo = (...messages) => {
  if (!getIsProd()) {
    Reflect.apply(console.log, undefined, messages)
  }
}

module.exports.logError = (...messages) => {
  Reflect.apply(console.error, undefined, messages)
}
