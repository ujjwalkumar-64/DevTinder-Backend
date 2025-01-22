import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"
import instance from "../utils/razorpay.js"
import { Payment } from "../models/payment.js";
import {membershipAmount} from "../utils/constant.js"
import {validateWebhookSignature} from 'razorpay/dist/utils/razorpay-utils.js'
import { User } from "../models/userSchema.js";

const paymentRouter= express.Router();

paymentRouter.post("/payment/create",authUser, async (req,res)=>{
    try {
        const {membershipType}= req.body;
        const {firstName,lastName,email}= req.user;
        

      const order= await instance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName,
                lastName,
                membershipType,
                email
            }
        })

         // save in db
         const payment= new Payment({
            userId:req.user._id,
            orderId:order.id,
            status:order.status,
            amount:order.amount,
            currency:order.currency,
            receipt:order.receipt,
            notes:order.notes



         })

         const savedPayment = await payment.save();

         // return back my order detail to frintend

         res.json({...savedPayment.toJSON(),keyId : process.env.RAZORPAY_KEY_ID})


    } catch (error) {
        return req.statusCode(500).json({message:error.message})
    }
})

paymentRouter.post("/payment/webhook",async (req,res)=>{
    try {
        const webhookSignature= req.get("X-Razorpay-Signature");
        const isWebhookValid= validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
        
        if(!isWebhookValid){
            return res.status(400).json({
                message:"webhook signature is invalid"
            })
        }

        //update in db payment status
        const paymentDetails= req.body.payload.payment.entity;

        const payment= await Payment.findOne({orderId:paymentDetails.order_id});
        payment.status=paymentDetails.status;
        await payment.save();


        if(payment.status ==="captured"){
        const user= await User.findOne({_id:payment.userId})

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.membershipType= payment.notes.membershipType;
        user.isPremium=true;
        await user.save();
        }
        else if (payment.status === "failed") {
            console.log(`Payment failed for Order ID: ${payment.orderId}`);
            
        }

  // update user status
      




      

        // if(req.body.event ==="payment.captured"){

        // }
        // if(req.body.event=== "payment.fail"){

        // }


            //return success res to razorpay
        return res.status(200).json({message:"webhook received successfully"})

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
})

paymentRouter.get("/premium/varify",authUser,async(req,res)=>{
    const user= req.user.toJSON();
    delete user.password;
    if(user.isPremium){
        return res.json({...user})
    }
    else{
        return res.json({...user})
    }
})

export  {
    paymentRouter
}