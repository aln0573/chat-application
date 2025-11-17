import Message from "../models/Message.js"
import User from "../models/User.js"
import cloudinary from '../config/cloudinary.js'

export const getAllContacts = async (req , res) => {
    try {
        const loggedInUserId = req.user._id

        const filteredUser = await User.find({_id: { $ne: loggedInUserId}}).select("-password")

        res.status(200).json(filteredUser)
    } catch (error) {
        console.error('Error in getAllContact controller',error.message);
        res.status(500).json({message: "Internal server error"})
    }
}


export const getMessagesById = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: userToChat } = req.params

        const messages = await Message.find({
            $or: [
                {senderId: myId, reciverId: userToChat},
                {senderId: userToChat, reciverId: myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.error('Error in getMessagesById Controller',error.message);
        res.status(500).json({message: "Internal server error"})
    }
}


export const sendMessages = async (req ,res) => {
    try {
        const { text , image } = req.body
        const { id: reciverId } = req.params
        const senderId = req.user._id

        let imageUrl
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessages = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        })

        await newMessages.save()

        res.status(201).json(newMessages)
    } catch (error) {
        console.error('Error in sendMessage controller: ', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}


export const getChatPartners = async (req ,res) => {
    try {
        const loggedInUserId = req.user._id

        const message = await Message.find({
            $or: [
                {senderId: loggedInUserId},
                {reciverId: loggedInUserId}
            ]
        })

        const chatPartnersId = [
            ...new Set(
             message.map((msg) =>
                 msg.senderId.toString() === loggedInUserId.toString() ? msg.reciverId.toString() : msg.senderId.toString()
             )
         )
      ];


        const chatPartners = await User.find({_id: { $in: chatPartnersId}}).select("-password")

        res.status(200).json(chatPartners)
    } catch (error) {
        console.error('Error in getChatPartners controller: ', error.message);
        res.status(500).json({message: "Internal server error"})
    }
}