import sharp from 'sharp'

export default class SharpImageCropper {
  getCropperStream (imageBuffer, width, ext, quality) {
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
