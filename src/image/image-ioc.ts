import { ImageCropper, ImageIocConfig } from './image'
import { Service, Token } from 'typedi'

export const ImageCropperTkn = new Token<ImageCropper>('ImageCropperTkn')

export const initImageIoc = (opts: ImageIocConfig) => {
  Service(ImageCropperTkn)(opts.ImageCropper)
}
