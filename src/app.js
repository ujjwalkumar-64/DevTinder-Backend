import express from "express"
import { mongoDB } from "./config/mongoDB.js";
 
import cookieParser from "cookie-parser";
 

import authRouter from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";

const app = express();
 app.use(express.json())
 app.use(cookieParser());
 
app.use("/",authRouter)
 app.use("/",profileRouter)
 
 try {
    await mongoDB()
    app.listen(3000, ()=>{
        console.log("server is successfully listen on port 3000")
    });


} catch (error) {
    console.log("server fail to connect: "+error)
}
