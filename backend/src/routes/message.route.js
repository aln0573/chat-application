import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getAllContacts, getChatPartners, getMessagesById, sendMessages } from '../controllers/message.controller.js'
import { arcjetProtection } from '../middleware/arcjet.middleware.js'

const router = express.Router()

router.use(arcjetProtection)

router.get('/contacts', protectRoute, getAllContacts)
router.get('/chats', protectRoute, getChatPartners)
router.get('/:id', protectRoute, getMessagesById)
router.post('/send/:id', protectRoute, sendMessages)

export default router