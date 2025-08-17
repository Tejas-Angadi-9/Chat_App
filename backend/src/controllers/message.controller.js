import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import { decryptData, encryptData } from "../libs/encryption.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password")
        res.status(200).json({
            success: true,
            message: "Successfully fetched the filtered users",
            data: filteredUsers
        })
    }
    catch (error) {
        console.error("Internal server error while fetching all the users: ", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server error while fetching the filtered users."
        })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        const decryptedMessages = messages.map((message) => ({
            ...message._doc,
            text: message.text ? decryptData(message.text) : null,
            image: message.image ? decryptData(message.image) : null
        }));


        res.status(200).json({
            success: true,
            message: "Successfully fetched all the messages",
            data: decryptedMessages
        })
    }
    catch (error) {
        console.error("Internal server error while fetching all the messages by this user: ", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server error while fetching the messages."
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        if (!text)
            res.status(400).json({
                success: false,
                message: "Please enter a text"
            })
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        let encryptedImageUrl;
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url
            encryptedImageUrl = encryptData(imageUrl)
        }

        const encryptedText = encryptData(text);
        console.log("EncryptedText: ", encryptedText)

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: encryptedText,
            image: encryptedImageUrl
        })

        await newMessage.save();

        //TODO: Realtime functionality goes here => Socket.io
        res.status(201).json({
            success: true,
            message: "Successfully sent the message.",
            data: newMessage
        })
    }
    catch (error) {
        console.error("Internal server error while sending the message: ", error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            data: "Internal server error while sending the message."
        })
    }
}