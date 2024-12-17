import express from "express";
import {authUser} from "../middlewares/auth.middleware.js"
import { ConnectionRequest } from "../models/connectionRequestSchema.js";
import { User } from "../models/userSchema.js";

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about"

userRouter.get("/user/requests/received", authUser, async (req,res)=>{
    try {
        const loggedInUser= req.user
        
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        .select("fromUserId")
        

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


userRouter.get("/user/feed", authUser, async(req,res)=>{
    try {
        const loggedInUser= req.user
        const page= parseInt(req.query.page) || 1
        let limit= parseInt(req.query.limit) || 10
        limit= limit >20 ? 10:limit
        const skip= (page-1)*limit

        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString())}
        )
        
        const users= await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne : loggedInUser._id}}
            ]

        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.json({
            message:"data fetch successfully",
            data:users
        })
    } catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
    
})


export {
    userRouter
}