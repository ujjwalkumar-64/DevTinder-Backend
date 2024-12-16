import jwt from "jsonwebtoken"
import { User } from "../models/userSchema.js"

const authUser = async(req,res,next)=>{
    try {
        const{token}= req.cookies
        const decodedMessage= await jwt.verify(token,"Fguxbybudy6ery4dyugufydyuf7et");

        const{_id}= decodedMessage;
        const user = await User.findById(_id);

        if(!user){
            throw new Error("invalid user")
        }
        req.user = user
        next();

    } catch (error) {
        res.send(400).send("error: ",error.message)
    }
}

export {
    authUser
}