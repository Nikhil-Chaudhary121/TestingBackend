import { Router } from 'express'
import { login, logout, register } from '../controllers/user.controller.js'
import protectedRoute from '../middleware/protectedRoute.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', protectedRoute, logout)

export default router
