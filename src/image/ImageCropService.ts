import { extname } from 'path';
import axios from 'axios'
import ImageCache from './cache/ImageCache'
import { OriginalImageFetchError } from './errors/OriginalImageFetchError'
import { ImageCropper, ImageCropServiceOptions, ImageCropServiceResult } from './image'
import { Readable } from 'stream'
import { Inject, Service } from 'typedi'
import { ImageCropperTkn } from './image-ioc'
import { StreamUtil } from '../core/utils/StreamUtil'
import { AppLogger } from '../core/log/AppLogger'

const DEFAULT_WIDTH = 320
const DEFAULT_QUALITY = 80

@Service()
export default class ImageCropService {
  @Inject(ImageCropperTkn)
  private cropper: ImageCropper

  @Inject()
  private cache: ImageCache

  async crop (options: ImageCropServiceOptions): Promise<ImageCropServiceResult> {
    if (!options.url) {
      return {}
    }

    const width = parseInt(options.width || '', 10) || DEFAULT_WIDTH
    const quality = parseInt(options.quality || '', 10) || DEFAULT_QUALITY
    const toJpeg = Boolean(options.toJpeg || false)
    const ext = (toJpeg) ? 'jpg' : this.getExtFromUrl(options.url)

    const cacheKey = this.cache.getKeyByOptions(options.url, width, toJpeg, quality)
    const cached = await this.cache.getCache(cacheKey)

    if (StreamUtil.isStream(cached)) {
      AppLogger.dev('Getting image from file system')

      return this.returnStream(cached as Readable, ext)
    } else if (cached) {
      AppLogger.dev('Getting image from memory')
      this.cache.updateCacheTtl(cacheKey)

      return this.returnBuffer(cached as Buffer, ext)
    }

    const resultStream = this.cropper.getCropperStream(
      await this.fetchOriginalImage(options.url),
      { width, ext, quality }
    )

    StreamUtil.streamToBuffer(resultStream).then(imageBuffer => this.cache.setCache(cacheKey, imageBuffer))

    return this.returnStream(resultStream, ext)
  }

  private async fetchOriginalImage (url: string) {
    let res
    try {
      res = await axios.get(url, {
        responseType: 'arraybuffer'
      })
    } catch (err) {
      throw new OriginalImageFetchError(err)
    }

    return Buffer.from(res.data, 'binary')
  }

  private getExtFromUrl (url: string) {
    let ext = extname(url).slice(1)

    // Если расширение слишком длинное (т.е. неправильное), либо его нет, то принудительно применяем jpg
    return (!ext || ext.length > 6) ? 'jpg' : ext
  }

  private returnStream (stream: Readable, ext: string) {
    return { stream, ext }
  }

  private returnBuffer (buffer: Buffer, ext: string) {
    return { buffer, ext }
  }
}
