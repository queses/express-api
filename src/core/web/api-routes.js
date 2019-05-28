import { Router } from 'express'
import imageController from '../../image/web/image-controller';

const apiRoutes = Router()

apiRoutes.use('/image', imageController)

export default apiRoutes
