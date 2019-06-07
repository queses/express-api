import gm from 'gm'
import { ImageCropper, ImageCropperOptions } from '../image'
import { Service } from 'typedi'

@Service()
export default class GmImageCropper implements ImageCropper {
  private gm: gm.SubClass

  constructor () {
    this.gm = gm.subClass({ imageMagick: true })
  }

  getCropperStream (imageBuffer: Buffer, opts: ImageCropperOptions) {
    return this.gm(imageBuffer, `image.${opts.ext}`).resize(opts.width).quality(opts.quality) as any
  }
}
