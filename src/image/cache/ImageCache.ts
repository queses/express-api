import touch from 'touch'
import fs from 'fs'
import { promisify } from 'util'
import { appConfig } from '../../config'
import { Readable } from 'stream'
import { Inject, Service } from 'typedi'
import { CryptoUtil } from '../../core/utils/CryptoUtil'
import { FsUtil } from '../../core/utils/FsUtil'
import { StreamUtil } from '../../core/utils/StreamUtil'
import { EnvUtil } from '../../core/utils/EnvUtil'
import { AppCache } from '../../core/cache/AppCache'

const CACHE_TTL = EnvUtil.parseInt(process.env.IMG_CACHE_TTL)
const FILE_CACHE_TTL = EnvUtil.parseInt(process.env.IMG_FILE_CACHE_TTL_HOURS)
const CACHE_KEY_PREFIX = 'image:'

const asyncTouch = promisify(touch)
const asyncWriteFile = promisify(fs.writeFile)

/**
 * Альтернатива `node-cache` - `node-cache-manager`
 */
@Service()
export default class ImageCache {
  @Inject()
  private appCache: AppCache

  get imagePath () {
    return appConfig.dataPath + '/image-crop'
  }

  async getCache (key: string): Promise<null | Buffer | Readable> {
    const memoryImageBuffer = await this.appCache.get(key, CACHE_KEY_PREFIX)
    if (memoryImageBuffer) {
      return memoryImageBuffer as Buffer
    }

    const filePath = this.imagePath + '/' + key
    if (await FsUtil.isPathExist(filePath)) {
      return this.readFile(filePath, key)
    }

    return null
  }

  async setCache (key: string, imageBuffer: Buffer) {
    this.appCache.set(key, imageBuffer, CACHE_KEY_PREFIX, CACHE_TTL).catch((err) => { throw err })

    const filePath = this.imagePath + '/' + key
    await asyncWriteFile(filePath, imageBuffer)

    FsUtil.removeOldFiles(this.imagePath, FILE_CACHE_TTL).catch((err) => { throw err })
  }

  updateCacheTtl (key: string) {
    this.appCache.updateTtl(key, CACHE_KEY_PREFIX, CACHE_TTL).catch((err) => { throw err })
  }

  getKeyByOptions (url: string, width: number, toJpeg: boolean, quality: number) {
    const str = `u=${url}&w=${width}&j=${toJpeg}&q=${quality}`
    return CryptoUtil.getHash(str, true)
  }

  private readFile (filePath: string, key: string) {
    const fileStream = fs.createReadStream(filePath)

    StreamUtil.streamToBuffer(fileStream).then(imageBuffer => this.setCache(key, imageBuffer))
    asyncTouch(filePath)

    return fileStream
  }
}
