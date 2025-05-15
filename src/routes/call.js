import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { CallHistory } from "../models/callHistory.js";

const callRouter = express.Router();

// Log start of a call
callRouter.post("/call/start", authUser, async (req, res) => {
    try {
        const { receiverId } = req.body;
        const callerId = req.user._id;

        // Create a new call record
        const newCall = new CallHistory({
            callerId,
            receiverId,
            startTime: new Date(),
        });

        const savedCall = await newCall.save();
        res.json({ message: "Call started successfully", data: savedCall });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Log end of a call
callRouter.post("/call/end", authUser, async (req, res) => {
    try {
        const { callId, status } = req.body;

        // Update the call record with end time and status
        const call = await CallHistory.findById(callId);
        if (!call) {
            throw new Error("Call record not found");
        }

        call.endTime = new Date();
        call.status = status || "completed";
        await call.save();

        res.json({ message: "Call ended successfully", data: call });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Retrieve call history for the logged-in user
callRouter.get("/call/history", authUser, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find calls where the user is either the caller or the receiver
        const callHistory = await CallHistory.find({
            $or: [
                { callerId: userId },
                { receiverId: userId },
            ],
        })
        .populate("callerId", "firstName lastName photoUrl")
        .populate("receiverId", "firstName lastName photoUrl")
        .sort({ createdAt: -1 });

        res.json({ message: "Call history fetched successfully", data: callHistory });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default callRouter;