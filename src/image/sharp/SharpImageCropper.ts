import sharp from 'sharp'
import { ImageCropper, ImageCropperOptions } from '../image'
import { Service } from 'typedi'

@Service()
export default class SharpImageCropper  implements ImageCropper  {
  getCropperStream (imageBuffer: Buffer, { ext, quality, width }: ImageCropperOptions) {
    const sharper = sharp(imageBuffer).resize(width)

    if (ext === 'jpg' || ext === 'jpeg') {
      return sharper.jpeg({ quality })
    } else if (ext === 'png') {
      return sharper.png({ quality })
    } else if (ext === 'webp') {
      return sharper.webp({ quality })
    } else if (ext === 'tiff') {
      return sharper.tiff({ quality })
    } else {
      return sharper
    }
  }
}
