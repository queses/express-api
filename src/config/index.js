const { resolve } = require('path')

const APP_PATH = './src'
const STATIC_PATH = resolve(APP_PATH + '/static')

module.exports.appConfig = {
  staticPath: STATIC_PATH
}
