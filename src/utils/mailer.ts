import ElasticEmail from '@elasticemail/elasticemail-client';
import config from '../constants/config';

const SENDER_EMAIL = config.email.sender;
const client = ElasticEmail.ApiClient.instance;

const apikey = client.authentications['apikey'];
apikey.apiKey = config.email.elasticemail_key;

export default async function elasticMailSender({
   email,
   title,
   text,
   html,
}: {
   email: string;
   title: string;
   text: string;
   html: string;
}) {
   const api = await new ElasticEmail.EmailsApi();
   const mail = ElasticEmail.EmailMessageData.constructFromObject({
      Recipients: [new ElasticEmail.EmailRecipient(email)],
      Content: {
         Body: [
            ElasticEmail.BodyPart.constructFromObject({
               ContentType: 'HTML',
               Content: html,
            }),
            ElasticEmail.BodyPart.constructFromObject({
               ContentType: 'PlainText',
               Content: text,
            }),
         ],
         Subject: title,
         From: SENDER_EMAIL,
      },
   });

   return await new Promise((resolve, reject) => {
      api.emailsPost(mail, async function (error: any, data: unknown) {
         if (error) reject(error);
         resolve(data);
      });
   });
}

export function genEmail(otp: string) {
   return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your OTP Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
          }
          .header {
            text-align: center;
            padding: 10px 0;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            margin: 20px 0;
            text-align: center;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your OTP Code</h1>
          </div>
          <div class="otp">
            ${otp}
          </div>
          <div class="footer">
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
}
