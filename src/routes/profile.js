import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"
import { validateEditProfileData } from "../utils/validation.js"
import bcrypt from "bcrypt";
import validator from "validator";

const profileRouter = express.Router()

profileRouter.get("/profile/view",authUser, async(req,res)=>{
    try {
        const user= req.user
        res.send(user);
    } catch (error) {
        res.status(400).send("error:" + error.message)
    }

})

profileRouter.patch("/profile/edit",authUser,async(req,res)=>{
    try {
       
       if(!validateEditProfileData(req)){
        throw new Error("invalid edit request")
       } 

       const user = req.user
        Object.keys(req.body).forEach((key)=>{user[key]=req.body[key]});
        
        await user.save();
        res.json({
            message:`${user.firstName}, your profile is updated successfully`,
            data:user
        })
         
    } catch (error) {
        res.send("error: "+ error)
    }
})

profileRouter.patch("/profile/password",authUser,async(req,res)=>{
    try {
        const {oldPassword,newPassword} = req.body
        const user= req.user

        const isPasswordValid= await user.validatePassword(oldPassword)
        if(!isPasswordValid){
            throw new Error("invalid credential")
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("new password is not strong")
        }

        const hashPassword = await bcrypt.hash(newPassword,10)
        
         user.password = hashPassword

    
        await user.save();

        res.json({message:"user password updated", data:user})
        
    } catch (error) {
        res.send("error in password :"+ error.message)
    }

})

export {
    profileRouter
}