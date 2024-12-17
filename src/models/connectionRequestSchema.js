import mongoose, { Mongoose } from "mongoose";
import { User } from "./userSchema.js";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:{
           values:["ignored","interested","accepted","rejected"],
           message:`{VALUE} is incorrect status type`
        },
         
    }
},{timestamps:true})

//index
connectionRequestSchema.index({fromUserId:1,toUserId:1})

//middleware to check request sent itself

connectionRequestSchema.pre("save",function(next){
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("you cannot send request to yourself")
    }
    next();
})

export const ConnectionRequest =  mongoose.model("ConnectionRequest",connectionRequestSchema)