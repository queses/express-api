import { initImageIoc } from '../image/image-ioc'
import SharpImageCropper from '../image/sharp/SharpImageCropper'
import { EnvUtil } from './utils/EnvUtil'
import GmImageCropper from '../image/gm/GmImageCropper'

const USE_IMAGEMAGICK = EnvUtil.parseInt(process.env.IMG_USE_IMAGEMAGICK)

export const initContainer = () => {
  const config = {
    image: {
      ImageCropper: USE_IMAGEMAGICK ? GmImageCropper : SharpImageCropper
    }
  }

  initImageIoc(config.image)
}
