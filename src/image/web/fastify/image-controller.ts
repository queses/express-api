import { FastifyInstance } from 'fastify'
import ImageCropService from '../../ImageCropService'
import { Container } from 'typedi'
import { ImageCropServiceResult } from '../../image'
import { OriginalImageFetchError } from '../../errors/OriginalImageFetchError'

export const imageController = async (fastify: FastifyInstance, opts: { basePath: string }) => {
  fastify.get(opts.basePath + '/thumb', async (req, rep) => {
    const options = {
      url: req.query.url,
      width: req.query.w,
      quality: req.query.q,
      toJpeg: req.query.j
    }

    let result: ImageCropServiceResult
    try {
      result = await Container.get(ImageCropService).crop(options)
    } catch (e) {
      if (e instanceof OriginalImageFetchError) {
        rep.status(404).send()
        return
      } else {
        throw e
      }
    }

    if (result.buffer && result.ext) {
      rep.type(`image/${result.ext}`).send(result.buffer)
    } else if (result.stream && result.ext) {
      rep.type(`image/${result.ext}`).send(result.stream)
    } else {
      rep.status(400).send()
    }
  })
}
