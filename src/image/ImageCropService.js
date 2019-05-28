const { isStream } = require('../utils/lang-utils')
const { streamToBuffer } = require('../utils/lang-utils')
const ImageCache = require('./cache/ImageCache')
const { logDevInfo } = require('../utils/log-utils')
const { extname } = require('path')
const axios = require('axios')
const OriginalImageFetchError = require('./errors/OriginalImageFetchError')

const DEFAULT_WIDTH = 320
const DEFAULT_QUALITY = 80

class ImageCropService {
  async crop (options, cropper) {
    if (!options.url) {
      return {}
    }

    const width = parseInt(options.width, 10) || DEFAULT_WIDTH
    const toJpeg = Boolean(options.toJpeg)
    const quality = options.quality || DEFAULT_QUALITY
    const ext = this._getExtFromUrl(options.url)

    const cacheKey = ImageCache.inst.getKeyByOptions(options.url, width, toJpeg, quality)
    const cached = await ImageCache.inst.getCache(cacheKey)

    if (isStream(cached)) {
      logDevInfo('Getting image from file system')

      return this._returnStream(cached, ext)
    } else if (cached) {
      logDevInfo('Getting image from memory')
      ImageCache.inst.updateCacheTtl(cacheKey)

      return this._returnBuffer(cached, ext)
    }

    const resultStream = cropper.getCropperStream(
      await this._fetchOriginalImage(options.url),
      width,
      this._getExtFromUrl(options.url),
      toJpeg,
      quality
    )

    streamToBuffer(resultStream).then(imageBuffer => ImageCache.inst.setCache(cacheKey, imageBuffer))

    return this._returnStream(resultStream, ext)
  }

  async _fetchOriginalImage (url) {
    let res
    try {
      res = await axios.get(url, {
        responseType: 'arraybuffer'
      })
    } catch (err) {
      throw OriginalImageFetchError(err)
    }

    return Buffer.from(res.data, 'binary')
  }

  _getExtFromUrl (url) {
    let ext = extname(url).slice(1)

    // Если расширение слишком длинное (т.е. неправильное), либо его нет, то принудительно применяем jpg
    return (!ext || ext.length > 6) ? 'jpg' : ext
  }

  _returnStream (stream, ext) {
    return { stream, ext }
  }

  _returnBuffer (buffer, ext) {
    return { buffer, ext }
  }

  static get inst () {
    if (!instance) {
      instance = new this()
    }
    return instance
  }
}

module.exports = ImageCropService

let instance
