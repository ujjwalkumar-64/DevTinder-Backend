import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{   
    userId:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    orderId:{
        type:String,
        required:true,
    },
    paymentId:{
        type:String,
    },
    amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
    },
    currency:{
        type:String,
        required:true
    },
    receipt:{
        type:String,
        required:true
    },
    notes:{
        firstName:{
            type:String,

        },
        lastName:{
            type:String
        }
    }



},{timestamps:true})

export  const Payment= mongoose.model("Payment",paymentSchema)