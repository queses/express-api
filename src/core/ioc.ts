import { initImageIoc } from '../image/image-ioc'
import SharpImageCropper from '../image/sharp/SharpImageCropper'

export const initContainer = () => {
  const config = {
    image: { ImageCropper: SharpImageCropper }
  }

  initImageIoc(config.image)
}
