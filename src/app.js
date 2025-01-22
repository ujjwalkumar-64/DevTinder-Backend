import express from "express"
import 'dotenv/config';
import { mongoDB } from "./config/mongoDB.js";
 
import cookieParser from "cookie-parser";
 
import cors from "cors";
import authRouter from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
 import { connectionRequestRouter } from "./routes/connectionRequest.js";
 import { userRouter } from "./routes/user.js";

import { paymentRouter } from "./routes/payment.js";

import "./utils/cronjob.js"

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
 app.use(express.json())
 app.use(cookieParser());
 
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",connectionRequestRouter)
app.use("/",userRouter)
app.use("/",paymentRouter)
 try {
    await mongoDB()
    app.listen(process.env.PORT, ()=>{
        console.log("server is successfully listen on port 3000")
    });


} catch (error) {
    console.log("server fail to connect: "+error)
}
