 import {startOfDay, endOfDay, subDays } from "date-fns"
import cron from "node-cron"
import { ConnectionRequest } from "../models/connectionRequestSchema.js";
import sendEmail from "./sendEmail.js";

 cron.schedule(' 0 8 * * *',async ()=>{
    
    // send email to all who got connections at everyday 8 am 
    try {
      const yesterday= subDays(new Date(),1);
        const yesterdayStart= startOfDay(yesterday) ;
        const yesterdayEnd= endOfDay(yesterday);
      
        const pendingRequests= await ConnectionRequest.find({
            status:"interested",
            createdAt:{
               $gte:yesterdayStart,
               $lt:yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        const listEmails = [ ...new Set(pendingRequests.map((req)=> req.toUserId.email))]
        console.log(listEmails);
        for(const email of listEmails){
          try {
            const res= await sendEmail.run("New Friend Requests pending for "+ email , 
               "there are so many request pending , please login to accept or reject request",email)
               console.log(res);
          } catch (error) {
            throw new Error("Error in email: "+ error);
          }
         
        }

    } catch (error) {
       console.log(error)
    }
 })