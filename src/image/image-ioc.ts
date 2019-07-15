import { ImageCropper } from './image'
import { Service, Token } from 'typedi'
import { EnvUtil } from '../core/utils/EnvUtil'
import GmImageCropper from './gm/GmImageCropper'
import SharpImageCropper from './sharp/SharpImageCropper'

const USE_IMAGEMAGICK = EnvUtil.parseBoolean(process.env.IMG_USE_IMAGEMAGICK)

export const ImageCropperTkn = new Token<ImageCropper>('ImageCropperTkn')

export const initImageIoc = () => {
  const config = {
    ImageCropper: USE_IMAGEMAGICK ? GmImageCropper : SharpImageCropper
  }

  Service(ImageCropperTkn)(config.ImageCropper)
}
