import mongoose from "mongoose";

const mongoDB = async() => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        await mongoose.connect(mongoURI);
        console.log("db connected")
    } catch (error) {
        console.log("error while db :"+ error)
        
    }
}
export {mongoDB};