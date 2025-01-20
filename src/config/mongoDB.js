import mongoose from "mongoose";

const mongoDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        await mongoose.connect(mongoURI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to the database:", error.message);
    }
};

export { mongoDB };
