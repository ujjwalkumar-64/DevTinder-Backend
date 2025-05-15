import { Server } from "socket.io";
import crypto from "crypto";
import { Chat } from "../models/chat.js";
import { ConnectionRequest } from "../models/connectionRequestSchema.js";


const getSecretRoomId= (userId,targetUserId)=>{
    return crypto.createHash("sha256")
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex")
}


const initializeSocket = (server) =>{
    const io = new Server(server,{
        cors:{
            origin:"http://localhost:5173",
        }
    });

    io.on("connection",(socket)=>{
       
        socket.on("joinChat",({firstName,userId,targetUserId})=>{
            const roomId = getSecretRoomId(userId,targetUserId); 
            console.log(firstName+" joining room: "+roomId);
            socket.join(roomId);
        }); 

        socket.on("sendMessage", async ({firstName,lastName,
            userId,
            targetUserId,
            text})=>{
               

                //save message to db
                try { 
                        const roomId = getSecretRoomId(userId,targetUserId);
                        console.log(firstName+ " " + text)

                        // check if friend or not

                        const checkFriendship= await ConnectionRequest.findOne({
                            $or:[
                                {fromUserId:targetUserId,toUserId:userId , status:"accepted"},
                                {fromUserId:userId,toUserId:targetUserId, status:"accepted"}
                            ],
                        })

                        if(!checkFriendship){
                            throw new Error("connection doesnot exist");
                        }

                        let chat= await Chat.findOne({
                       participants: {$all:[userId,targetUserId]},
                    })

                    if(!chat){
                        chat= new Chat({
                            participants:[userId,targetUserId],
                            messages:[]
                        });
                    }

                    chat.messages.push({
                        senderId:userId,
                        text
                    });

                    await chat.save();

                    io.to(roomId).emit("messageReceived",{firstName,text ,lastName}) //timeStamp:new Date()

                } catch (error) {
                    console.log("error in message save : ",error)
                    
                }

               

        });

        // // Handle start of a call
        // socket.on("startCall", async ({ userId, targetUserId }) => {
        //     try {
        //         const newCall = new CallHistory({
        //             callerId: userId,
        //             receiverId: targetUserId,
        //             startTime: new Date(),
        //         });
        //         const savedCall = await newCall.save();
        //         io.to(getSecretRoomId(userId, targetUserId)).emit("callStarted", savedCall);
        //     } catch (error) {
        //         console.log("Error logging call start: ", error);
        //     }
        // });

        // // Handle signaling data exchange
        // socket.on("signalData", ({ userId, targetUserId, signal }) => {
        //     const roomId = getSecretRoomId(userId, targetUserId);
        //     io.to(roomId).emit("signalDataReceived", { userId, signal });
        // });

        //  // Handle end of a call
        // socket.on("endCall", async ({ callId, status }) => {
        //     try {
        //         const call = await CallHistory.findById(callId);
        //         if (call) {
        //             call.endTime = new Date();
        //             call.status = status || "completed";
        //             await call.save();
        //             io.to(getSecretRoomId(call.callerId, call.receiverId)).emit("callEnded", call);
        //         }
        //     } catch (error) {
        //         console.log("Error logging call end: ", error);
        //     }
        // });

    
            // Handle video call initiation
            socket.on("joinRoom", async ({ firstName,userId,targetUserId }) => {
                const roomId = getSecretRoomId(userId,targetUserId,);
                console.log(`${firstName} joining video room: + ${roomId}`);
                socket.join(roomId);
                io.to(roomId).emit("callStarted", { targetUserId, userId, roomId });
            });
 


            // Handle WebRTC signaling data
            socket.on("signalData", ({ userId,targetUserId, signalData }) => {
                 const roomId = getSecretRoomId(userId,targetUserId,);
                    console.log(`Signal data sent to room: ${roomId}`);
                io.to(roomId).emit("signalDataReceived", signalData);
            });

            // Handle call end
            socket.on("endCall", async ({ callId, roomId }) => {
                io.to(roomId).emit("callEnded", { callId });
                socket.leave(roomId);
            });

            
    
        socket.on("disconnect",()=>{
            
        })
    })
}

export default initializeSocket; 