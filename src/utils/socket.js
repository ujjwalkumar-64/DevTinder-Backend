import { Server } from "socket.io";
import crypto from "crypto";
import { Chat } from "../models/chat.js";
import { ConnectionRequest } from "../models/connectionRequestSchema.js";
import { runCodeWithJudge0 } from "./judgeO.js";

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    // --- CHAT
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          const checkFriendship = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
            ],
          });
          if (!checkFriendship) throw new Error("connection does not exist");
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ senderId: userId, text });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, text, lastName });
        } catch (error) {
          console.log("error in message save : ", error);
        }
      }
    );

    // --- VIDEO CALL
    socket.on("joinRoom", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
      io.to(roomId).emit("callStarted", { targetUserId, userId, roomId });
    });

    socket.on("signalData", ({ userId, targetUserId, signalData }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      io.to(roomId).emit("signalDataReceived", {
        signalData,
        senderId: userId,
      });
    });

    socket.on("endCall", async ({ callId, roomId, userId, targetUserId }) => {
      const actualRoomId = roomId || getSecretRoomId(userId, targetUserId);
      io.to(actualRoomId).emit("callEnded", { callId });
      socket.leave(actualRoomId);
    });

    // --- COLLABORATIVE CODE SANDBOX

    socket.on("joinCodeRoom", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined code room: ${roomId}`);
    });

    socket.on("contentChanged", ({ content, roomId }) => {
      socket.to(roomId).emit("contentChanged", { content });
    });

    socket.on("languageChanged", ({ language, roomId }) => {
      socket.to(roomId).emit("languageChanged", { language });
    });

    socket.on("runCode", async ({ code, language, roomId }) => {
      try {
        const result = await runCodeWithJudge0(language, code);
        io.to(roomId).emit("codeOutput", {
          success: true,
          output: result.output || result,
        });
      } catch (err) {
        io.to(roomId).emit("codeOutput", {
          success: false,
          error: err.message,
        });
      }
    });

    socket.on("disconnect", () => {});
  });
};

export default initializeSocket;
