const nodemailer = require('nodemailer');
import { IMailOptions } from "../types";

const transporter = nodemailer.createTransport({
    host: 'smtp.poczta.onet.pl',
    port: 465,
    secure: true, 
    auth: {
      user: '****',
      pass: '****'
    }
  });



export const sendMail = (mailOptions: IMailOptions) => {
    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
        console.log('rwrwqrqwr')
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}