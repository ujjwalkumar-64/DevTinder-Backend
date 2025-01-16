import mongoose from "mongoose";

const mongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("db connected")
    } catch (error) {
        console.log("error while db :"+ error)
        
    }
}
export {mongoDB};