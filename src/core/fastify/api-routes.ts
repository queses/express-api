import { FastifyInstance } from 'fastify'
import { imageController } from '../../image/web/fastify/image-controller'

export const apiRoutes = async (fastify: FastifyInstance) => {
  fastify.register(imageController, {
    basePath: '/api/image'
  })
}
