import mongoose from "mongoose";

const mongoDB = async() => {
    try {
        await mongoose.connect('mongodb+srv://22cs3064:nViEFdRMm3khHWe1@devtinder.3ir8h.mongodb.net/devTinder')
        console.log("db connected")
    } catch (error) {
        console.log("error while db :"+ error)
        
    }
}
export {mongoDB}