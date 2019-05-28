const sharp = require('sharp')

class SharpImageCropper {
  getCropperStream (imageBuffer, width, ext, toJpeg, quality) {
    const sharper = sharp(imageBuffer).resize(width)

    if (ext === 'jpg' || ext === 'jpeg' || toJpeg) {
      return sharper.jpeg({ quality })
    } else {
      return sharper
    }
  }
}

module.exports = SharpImageCropper
