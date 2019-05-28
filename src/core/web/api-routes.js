const { Router } = require('express')
const imageController = require('../../image/web/image-controller')

const apiRoutes = Router()

apiRoutes.use('/image', imageController)

module.exports = apiRoutes
