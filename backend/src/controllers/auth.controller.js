import { generateToken } from "../config/utils.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'

export const SignUp = async (req, res) => {
    try {
        const {fullName , email , password } = req.body

        if(!fullName || !email || !password ) {
            return res.status(400).json({message: "All fileds are required"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Inavlid email format"})
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Password should be atleast 6 characters"})
        }

        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({message: "Email already exist."})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }else{
            res.status(400).json({message: "invalid user data"})
        }
    } catch (error) {
        console.error('Error in SignUp controller', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}