import mongoose from "mongoose";

const messageSchema=  new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    text:[
        {
            type:String,
            required:true
        }
    ]
},{timestamps:true})

const chatSchema= new  mongoose.Schema(
    {   
        // this participant schema is also valid for group chat
        participants:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }],
        messages:[messageSchema] , // schema into schema , separate schema for redable

    },{timestamps:true}
)

const Chat= mongoose.model("Chat",chatSchema);

export {Chat}