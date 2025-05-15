import express from "express"
import bcrypt from "bcrypt"
import { User } from "../models/userSchema.js";
import { validateEditProfileData,validateSignupData } from "../utils/validation.js";


const authRouter = express.Router()

import axios from "axios";

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, email, password, age, gender, photoUrl, about, skills, githubUsername } = req.body;

        let githubData = {};
        if (githubUsername) {
            // Fetch GitHub user details
            const githubResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);
            githubData = {
                photoUrl: githubResponse.data.avatar_url,
                about: githubResponse.data.bio || "GitHub Developer",
            };

            // Fetch repositories to infer skills
            const reposResponse = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
            const languages = new Set();
            reposResponse.data.forEach(repo => {
                if (repo.language) {
                    languages.add(repo.language);
                }
            });

            githubData.skills = Array.from(languages).slice(0, 10); // Limit to 10 skills
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age,
            gender: githubData.gender || gender,
            photoUrl: githubData.photoUrl || photoUrl,
            about: githubData.about || about,
            skills: githubData.skills || skills,
            githubUsername,
        });

        const savedUser = await user.save();
        const token = await savedUser.getJwt();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 1 * 3600000),
        });

        res.json({ message: "User added successfully!", data: savedUser });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});

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