import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:4,
        index:true,
    },
    lastName:{
        type:String,
        trim:true,
        index:true,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is not correct format")
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is not strong")
            }
        }
        
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:{
            values:["male","female","others"],
            message:`{VALUE} is not valid type`
        }
        
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    membershipType:{
        type:String,
    },
    photoUrl:{
        type:String,
        default:"https://geographyandyou.com/images/user-profile.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("url is not correct")
            }
        }
    },
    about:{
        type:String,     
    },
    skills:{
        type:[String],
        validate(value){
            if(value.length>10){
                throw new Error("string lenth must be less than 10")
            }
        }
    },
    
    
},{timestamps:true})

userSchema.methods.validatePassword= async function (inputPassword){
    const hashPassoword= this.password

    const isPasswordValid = await bcrypt.compare(
        inputPassword,
        hashPassoword
    );
    return isPasswordValid;
}

userSchema.methods.getJwt= async function () {
    
    const token= await jwt.sign({_id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:"1d"
    })

    return token;
}


export const User = mongoose.model("User",userSchema)