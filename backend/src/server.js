import express from 'express'
import 'dotenv/config'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'

const app = express()
const PORT = process.env.PORT

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    connectDB()
})