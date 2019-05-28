import NodeCache from 'node-cache'
import touch from 'touch'
import fs from 'fs'
import { promisify } from 'util'
import { appConfig } from '../../config';
import { isPathExist, removeOldFiles } from '../../utils/fs-uitls';
import { streamToBuffer } from '../../utils/lang-utils';
import { getHash } from '../../utils/crypto-utils';

const CACHE_TTL = process.env.IMG_CACHE_TTL
const CACHE_PERIOD = process.env.IMG_CACHE_PERIOD
const FILE_CACHE_TTL = process.env.IMG_FILE_CACHE_TTL_HOURS

const asyncTouch = promisify(touch)
const asyncWriteFile = promisify(fs.writeFile)

export default class ImageCache {
  get imagePath () {
    return appConfig.dataPath + '/image-crop'
  }

  constructor () {
    this._cache = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: CACHE_PERIOD
    });
  }

  async getCache (key) {
    const memoryImageBuffer = this._cache.get(key)
    if (memoryImageBuffer) {
      return memoryImageBuffer
    }

    const filePath = this.imagePath + '/' + key
    if (await isPathExist(filePath)) {
      return this._readFile(filePath, key)
    }
  }

  async setCache (key, imageBuffer) {
    this._cache.set(key, imageBuffer, () => {})

    const filePath = this.imagePath + '/' + key

    await asyncWriteFile(filePath, imageBuffer)
    removeOldFiles(this.imagePath, FILE_CACHE_TTL)
  }

  updateCacheTtl (key) {
    this._cache.ttl(key, CACHE_TTL, () => {})
  }

  getKeyByOptions (url, width, toJpeg, quality) {
    const str = `u=${url}&w=${width}&j=${toJpeg}&q=${quality}`
    return getHash(str, true)
  }

  _readFile (filePath, key) {
    const fileStream = fs.createReadStream(filePath)

    streamToBuffer(fileStream).then(imageBuffer => ImageCache.inst.setCache(key, imageBuffer))
    asyncTouch(filePath)

    return fileStream
  }

  static get inst () {
    if (!instance) {
      instance = new this()
    }
    return instance
  }
}

let instance
