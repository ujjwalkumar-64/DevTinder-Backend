import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema({
    callerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: { 
        type: String, 
        enum: ["completed", "missed", "rejected"], 
        default: "completed" 
    },
}, { timestamps: true });

export const CallHistory = mongoose.model("CallHistory", callHistorySchema);