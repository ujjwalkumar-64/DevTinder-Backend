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

        socket.on("disconnect",()=>{
            
        })
    })
}

export default initializeSocket; 