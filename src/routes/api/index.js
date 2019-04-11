import { Router } from 'express'

import users from './users'
import image from './image'

var router = Router()

// Add USERS Routes
router.use(users)
router.use(image)

export default router
