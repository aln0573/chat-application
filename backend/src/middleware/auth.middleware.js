import jwt from 'jsonwebtoken'
import 'dotenv/config'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message: "UnAuthorized - No Token Provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message: "UnAuthorized - Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(400).json({message: "User not found!"})
        }

        req.user = user
        next()
    } catch (error) {
        console.error('Error in protectedRoute in auth middleware', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}