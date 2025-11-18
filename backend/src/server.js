import express from 'express'
import 'dotenv/config'
import path from 'path'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import cors from 'cors'
import { app, server } from './config/socket.js'


const PORT = process.env.PORT

app.use(express.json({limit: "10mb"}))
app.use(cors({
    origin: "https://chat-applications-front.onrender.com",
    credentials: true
}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)


server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})