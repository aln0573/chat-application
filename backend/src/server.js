import express from 'express'
import 'dotenv/config'
import path from 'path'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)


app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})