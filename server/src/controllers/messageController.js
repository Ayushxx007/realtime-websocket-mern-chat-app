import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import mongoose from "mongoose";

export const getUsersforSideBar=async(req,res)=>{

    try{

        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

       return  res.status(200).json(filteredUsers);





    }catch(err){
        console.error("Error in getUsersforSideBar:", err);
       return  res.status(500).json({
            message:"Error getting users",
        })
    }


}

export const getMessages=async(req,res)=>{

    try{

        const loggedInUserId = req.user._id;
        const {id:userToChatId} = req.params;

        if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
            return res.status(400).json({
                message: "Invalid user id",
            });
        }

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId,receiverId:userToChatId  },
                { receiverId: loggedInUserId, senderId:userToChatId   }
            ]
        }).sort({ createdAt: 1 });  //sorts

        return res.status(200).json(messages);






    }catch(err){
        console.error("Error in getMessages:", err);
        return res.status(500).json({
            message:"Error getting messages",
        })
    }

}


export const sendMessage=async(req,res)=>{

    try{
        const {id:userToChatId} = req.params;
        const {text,image}=req.body;
        const loggedInUserId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({
                message: "Message cannot be empty",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
            return res.status(400).json({
                message: "Invalid user id",
            });
        }

        const receiver = await User.findById(userToChatId);

        if (!receiver) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (loggedInUserId.toString() === userToChatId) {
            return res.status(400).json({
                message: "Cannot send messages to yourself",
            });
        }





        let imageUrl;

        if(image){

            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl =  uploadResponse.secure_url

        }

        const newMessage = new Message({
            senderId:loggedInUserId,
            receiverId:userToChatId,
            text,
            image:imageUrl
        })
        await newMessage.save();
        return res.status(201).json(newMessage);

       //^todo realtime functionality goes here




    }catch(err){
        console.error("Error in sendMessage:", err);
        return res.status(500).json({
            message:"Error sending message",
        })
    }


}