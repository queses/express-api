import { resolve } from 'path'

const STATIC_PATH = resolve('./static')
const DATA_PATH = resolve('./data')

export const appConfig = {
  staticPath: STATIC_PATH,
  dataPath: DATA_PATH
}
