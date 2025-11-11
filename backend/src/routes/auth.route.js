import express from 'express'
import { SignIn, SignOut, SignUp } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', SignUp)
router.post('/signin', SignIn)
router.post('/logout', SignOut)
export default router