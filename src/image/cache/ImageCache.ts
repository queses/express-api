import NodeCache from 'node-cache'
import touch from 'touch'
import fs from 'fs'
import { promisify } from 'util'
import { appConfig } from '../../config';
import { isPathExist, removeOldFiles } from '../../utils/fs-uitls';
import { streamToBuffer } from '../../utils/lang-utils';
import { getHash } from '../../utils/crypto-utils';
import { Readable } from 'stream'
import { Service } from 'typedi'

const CACHE_TTL = parseInt(process.env.IMG_CACHE_TTL || '', 10)
const CACHE_PERIOD = parseInt(process.env.IMG_CACHE_PERIOD || '', 10)
const FILE_CACHE_TTL = parseInt(process.env.IMG_FILE_CACHE_TTL_HOURS || '', 10)

const asyncTouch = promisify(touch)
const asyncWriteFile = promisify(fs.writeFile)

/**
 * Альтернатива `node-cache` - `node-cache-manager`
 */
@Service()
export default class ImageCache {
  private _cache: NodeCache

  get imagePath () {
    return appConfig.dataPath + '/image-crop'
  }

  constructor () {
    this._cache = new NodeCache({
      stdTTL: CACHE_TTL,
      checkperiod: CACHE_PERIOD
    });
  }

  async getCache (key: string): Promise<null | Buffer | Readable> {
    const memoryImageBuffer = this._cache.get(key)
    if (memoryImageBuffer) {
      return memoryImageBuffer as Buffer
    }

    const filePath = this.imagePath + '/' + key
    if (await isPathExist(filePath)) {
      return this.readFile(filePath, key)
    }

    return null
  }

  async setCache (key: string, imageBuffer: Buffer) {
    this._cache.set(key, imageBuffer, () => {})

    const filePath = this.imagePath + '/' + key

    await asyncWriteFile(filePath, imageBuffer)

    removeOldFiles(this.imagePath, FILE_CACHE_TTL)
  }

  updateCacheTtl (key: string) {
    this._cache.ttl(key, CACHE_TTL, () => {})
  }

  getKeyByOptions (url: string, width: number, toJpeg: boolean, quality: number) {
    const str = `u=${url}&w=${width}&j=${toJpeg}&q=${quality}`
    return getHash(str, true)
  }

  private readFile (filePath: string, key: string) {
    const fileStream = fs.createReadStream(filePath)

    streamToBuffer(fileStream).then(imageBuffer => this.setCache(key, imageBuffer))
    asyncTouch(filePath)

    return fileStream
  }
}
