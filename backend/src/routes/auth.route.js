import express from 'express'
import { SignIn, SignOut, SignUp, updateProfile } from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/logout', SignOut)
router.put('/update-profile', protectRoute, updateProfile)

router.get('/check', protectRoute, (req, res) => {
    res.status(200).json(req.user)
})
export default router