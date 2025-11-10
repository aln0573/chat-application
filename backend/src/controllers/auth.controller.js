import { generateToken } from "../config/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'

export const SignUp = async (req, res) => {
    try {
        const { fullName, email, password } = req.body

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters" })
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        generateToken(savedUser._id, res)

        res.status(201).json({
            _id: savedUser._id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            profilePic: savedUser.profilePic
        })

    } catch (error) {
        console.error('Error in SignUp controller:', error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}
