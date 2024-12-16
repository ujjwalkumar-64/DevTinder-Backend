import mongoose from "mongoose";

const mongoDB = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/apiTesting')
        console.log("db connected")
    } catch (error) {
        console.log("error while db :"+ error)
        
    }
}
export {mongoDB}