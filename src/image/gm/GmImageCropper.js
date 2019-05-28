import gm from 'gm'

export default class GmImageCropper {
  constructor () {
    this.gm = gm.subClass({ imageMagick: true })
  }

  getCropperStream (imageBuffer, width, ext, quality) {
    return this.gm(imageBuffer, `image.${ext}`).resize(width).quality(quality)
  }
}
