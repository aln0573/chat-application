import cloudinary from "../config/cloudinary.js"
import { generateToken } from "../config/utils.js"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import 'dotenv/config'

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

        try {
            await sendWelcomeEmail(savedUser.email, savedUser.fullName, process.env.CLIENT_URL)
        } catch (error) {
            console.error('Failed to send welcome email',error);
        }

    } catch (error) {
        console.error('Error in SignUp controller:', error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const SignIn = async (req , res) => {
    try {
        const { email , password } = req.body

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "user not found"})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if(!passwordMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}



export const SignOut = (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "none",
            secure: true
        })
        res.status(200).json({message: "Logout successfully"})
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }

        const userId = req.user._id
        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const savedUpload = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        },{new: true})

        res.status(200).json(savedUpload)
    } catch (error) {
        console.error('Error in updateProfile', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}