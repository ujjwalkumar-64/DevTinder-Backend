import express from "express"
import { authUser } from "../middlewares/auth.middleware.js";
import { Chat } from "../models/chat.js";

const chatRouter= express.Router();

chatRouter.get("/chat/:targetUserId",authUser,async(req,res)=>{
    try {
        const userId = req.user._id;
        const {targetUserId}=req.params;

        let chat= await Chat.findOne({
            participants:{$all:[userId,targetUserId]}
        }).populate({
            path:"messages.senderId",
            select:"firstName lastName",
        })

        if(!chat){
            chat= new Chat({
                participants:[userId,targetUserId],
                messages:[]
            })
            await chat.save();
        }   

        res.json(chat)

    } catch (error) {
        res.status(500).json({"message":error.message})
    }
})

export default chatRouter;