import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { ConnectionRequest } from "../models/connectionRequestSchema.js";
import { User } from "../models/userSchema.js";
import sendEmail from "../utils/sendEmail.js"

const connectionRequestRouter = express.Router()

connectionRequestRouter.post("/request/send/:status/:toUserId", authUser, async (req,res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const toUser= await User.findById(toUserId);

        if(!toUser){
            throw new Error("invalid toUser ")
        }
        const allowedStatus =["interested","ignored"]
        if(!allowedStatus.includes(status)){
            throw new Error("status is not valid type: "+ status)
        }
         
        // need for index in schema of connection
        const existingConnection = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ],
        })
        if(existingConnection){
            throw new Error("connection already exist")
        }

        const data = await new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        }).save()
        
        const emailRes = await sendEmail.run("A New Friend Request from "+ req.user.firstName ,
            req.user.firstName + " " + status + " " +toUser.firstName,
            toUser.email
        )
        console.log(emailRes);

        

        res.json({
            message:
            req.user.firstName + " " + status + " " +toUser.firstName,
            data
        })
    
    } catch (error) {
        res.status(400).send("Error: "+ error.message)
    }

})

connectionRequestRouter.post("/request/review/:status/:requestId",authUser, async(req,res)=>{
    try {
        const requestId= req.params.requestId
        const status= req.params.status
        const validStatus= ["accepted","rejected"]
        
        if(!validStatus.includes(status)){
            throw new Error("status is not valid type:" +status)
        }
        const loginUserId= req.user._id;

        const connection = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loginUserId,
            status:"interested",
        })

        if(!connection){
            throw new Error("connection not found ")
        }

      
        connection.status= status
       const data= await connection.save()
        
        res.json({
            message:`connection request ${status}`,
            data
        })
    } catch (error) {
        res.status(400).send("Error: "+ error.message)
    }
})


export {
    connectionRequestRouter
}