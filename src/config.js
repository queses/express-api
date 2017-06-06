import { resolve } from 'path'
const APP_PATH = './src'

const STATIC_PATH = resolve(APP_PATH + '/static')

export default {
  staticPath: STATIC_PATH,
  dirs: [
  	STATIC_PATH + '/data',
  	STATIC_PATH + '/data/sharp'
  ]
}
