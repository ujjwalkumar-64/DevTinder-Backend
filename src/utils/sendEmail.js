import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClient.js";

const createSendEmailCommand = (toAddress, fromAddress , subject, body) => {
    return new SendEmailCommand({
      Destination: {
         
        CcAddresses: [
          
        ],
        ToAddresses: [
          toAddress,
          
        ],
      },
      Message: {
      
        Body: {
           
          Html: {
            Charset: "UTF-8",
            Data: `<h1>${body}</h1>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "<h1>This is text format of body</h1>",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
        /* more items */
      ],
    });
  };
  
  const run = async (subject,body,toEmailId) => {
    const sendEmailCommand = createSendEmailCommand(
      "devproject3064@gmail.com",
      process.env.FROM_EMAILID,
      subject,
      body
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
      
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        console.log(messageRejectedError);
        return messageRejectedError;
      }
      throw caught;
    }
  };
  
  export default { run };