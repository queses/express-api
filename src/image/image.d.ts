import { Readable } from 'stream'
import { ConstructorType } from '../core/core'

export type ImageIocConfig = {
  ImageCropper: ConstructorType<ImageCropper>
}

export type ImageCropServiceOptions = {
  url: string
  width?: string
  quality?: string
  toJpeg?: boolean
}

export type ImageCropServiceResult = {
  buffer?: Buffer
  stream?: Readable
  ext?: string
}

export interface ImageCropper {
  getCropperStream (imageBuffer: Buffer, imageCropperOptions: ImageCropperOptions): Readable
}

export type ImageCropperOptions = {
  width: number
  ext: string
  quality: number
}
