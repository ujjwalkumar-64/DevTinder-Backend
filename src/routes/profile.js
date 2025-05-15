import express from "express"
import {authUser} from "../middlewares/auth.middleware.js"
import { validateEditProfileData } from "../utils/validation.js"
import bcrypt from "bcrypt";
import validator from "validator";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const profileRouter = express.Router()

profileRouter.get("/profile/view",authUser, async(req,res)=>{
    try {
        const user= req.user
        res.send(user);
    } catch (error) {
        res.status(400).send("error:" + error.message)
    }

})


profileRouter.patch("/profile/edit",authUser,upload.fields([
    {
      name: "photoUrl",  
      maxCount: 1,    
    },
  ]),async(req,res)=>{
    try {
       
       if(!validateEditProfileData(req)){
        throw new Error("invalid edit request")
       } 
       


       const user = req.user

       if (user) {

        let avatarLocalPath;
       if( req.files && Array.isArray(req.files.photoUrl) && req.files.photoUrl.length>0){
        avatarLocalPath= req.files.photoUrl[0].path

       }

         
        const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);

         
        if (avatarUploadResponse && avatarUploadResponse) {
          user.photoUrl = avatarUploadResponse;
        }
      }
        Object.keys(req.body).forEach((key)=>{user[key]=req.body[key]});
        
        await user.save();
        res.json({
            message:`${user.firstName}, your profile is updated successfully`,
            data:user
        })
         
    } catch (error) {
        res.status(400).send("error:" + error.message)
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
         res.status(400).json({ message: error.message });
    }

})

profileRouter.post("/profile/sync-github", authUser, async (req, res) => {
    try {
        const { githubUsername } = req.body;

        if (!githubUsername) {
            throw new Error("GitHub username is required");
        }

        const githubResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);
        const reposResponse = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);

        const languages = new Set();
        reposResponse.data.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });

        const user = req.user;
        user.githubUsername = githubUsername;
        user.photoUrl = githubResponse.data.avatar_url;
        user.about = githubResponse.data.bio || "GitHub Developer";
        user.skills = Array.from(languages).slice(0, 10); // Limit to 10 skills

        await user.save();

        res.json({
            message: "GitHub data synced successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
});
profileRouter.patch("/profile/preference", authUser, async (req, res) => {
    try {
        const { preferredGender } = req.body;

        if (!["male", "female", "all"].includes(preferredGender)) {
            throw new Error("Invalid preferred gender value");
        }

        const user = req.user;
        user.preferredGender = preferredGender;
        await user.save();

        res.json({
            message: "Preference updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});

export {
    profileRouter
}