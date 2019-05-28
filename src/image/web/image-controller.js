import { Router } from 'express'
import SharpImageCropper from '../sharp/SharpImageCropper';
import ImageCropService from '../ImageCropService';

const imageController = Router()

const sharpCropper = new SharpImageCropper()

imageController.get('/thumb', async function (req, res, next) {
  const options = {
    url: req.query.url,
    width: req.query.w,
    quality: req.query.q,
    toJpeg: req.query.j
  }

  const result = await ImageCropService.inst.crop(options, sharpCropper)

  if (result.buffer && result.ext) {
    res.type(`image/${result.ext}`).send(result.buffer)
  } else if (result.stream && result.ext) {
    res.type(`image/${result.ext}`)
    result.stream.pipe(res)
  } else {
    res.status(400).end()
  }
})

export default imageController
