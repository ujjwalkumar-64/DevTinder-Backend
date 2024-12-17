import express from "express";
import {authUser} from "../middlewares/auth.middleware.js"
import { ConnectionRequest } from "../models/connectionRequestSchema.js";

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about"

userRouter.get("/user/requests/received", authUser, async (req,res)=>{
    try {
        const loggedInUser= req.user
        
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        

        res.json({
            message:"data fetsch succesfully",
            data:connectionRequest
        })
    
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }

}) 

userRouter.get("/user/connections",authUser, async (req,res)=>{
    try {
        const loggedInUser = req.user
        const connections= await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser},
                {fromUserId:loggedInUser}
            ],
            status:"accepted"
        }).populate("fromUserId toUserId",USER_SAFE_DATA)

        const data = connections.map((row)=>  
            row.toUserId.equals(loggedInUser._id) ? row.fromUserId : row.toUserId
        )

        res.json({
            message:"data fetch successfully",
            data 
        })


    } catch (error) {
        res.status(400).send("ERROR: "+ error.message)
    }
})


export {
    userRouter
}