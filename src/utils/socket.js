import { Server } from "socket.io";
import crypto from "crypto";

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
            const roomId = getSecretRoomId(userId,targetUserId); // unique
            console.log(firstName+" joining room: "+roomId)
            socket.join(roomId);
        }); 

        socket.on("sendMessage",({firstName,
            userId,
            targetUserId,
            text})=>{
                const roomId = getSecretRoomId(userId,targetUserId);
                console.log(firstName+ " " + text)
                io.to(roomId).emit("messageReceived",{firstName,text})

        });

        socket.on("disconnect",()=>{

        })
    })
}

export default initializeSocket; 