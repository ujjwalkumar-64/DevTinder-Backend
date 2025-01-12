import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/userSchema.js";
import { validateEditProfileData,validateSignupData } from "../utils/validation.js";


const authRouter = express.Router()

authRouter.post("/signup",async (req,res)=>{
    try {
        validateSignupData(req);
        const {firstName,lastName,email,password,age,gender,photoUrl,about,skills} = req.body
    
        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            firstName,
            lastName,
            email,
            password:hashPassword,
            age,
            gender,
            photoUrl,
            about,
            skills
        })
    
        const savedUser= await user.save()
        const token= await savedUser.getJwt();
            res.cookie("token",token,{
                expires: new Date(Date.now()+ 1 * 3600000)
            })
            
          
        res.json({message:"user added successfully!", data: savedUser})

    } catch (error) {
        res.status(400).send("error: " + error.message)
    }

})

authRouter.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        const user = await User.findOne({email:email}) 
        if(!user){
            throw new Error("invalid credential")
        }
        const isPasswordValid = await user.validatePassword(password)

        if(!isPasswordValid){
             
            throw new Error("invalid credential")
        }
        else{
             
            const token= await user.getJwt();
            res.cookie("token",token,{
                expires: new Date(Date.now()+ 1 * 3600000)
            })
            
            res.json({
                message:"user login successfully",
                data:user
            })

        }

    } catch (error) {
        res.status(404).send("error :" + error.message)
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:
            new Date(Date.now())
        
    })
    res.json({
        message:"user logged out"
    })
})

export default authRouter;