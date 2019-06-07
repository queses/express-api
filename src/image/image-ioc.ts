import { ImageCropper, ImageIocConfig } from './image'
import { Container, Token } from 'typedi'

export const ImageCropperTkn = new Token<ImageCropper>('ImageCropperTkn')

export const initImageIoc = (opts: ImageIocConfig) => {
  Container.set(ImageCropperTkn, opts.ImageCropper)
}
