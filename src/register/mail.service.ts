import { Injectable } from '@nestjs/common';    
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {

    private transport: nodemailer.Transporter;
    constructor() {
            this.transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                secure: false,
                auth: {
                    user: "8ede8264937766",
                    pass: "1a3a1c5543bd5f"
                    }
                });
    }
    async sendMail(email:any, token:any){
        console.log(email.email,token);
        
        await this.transport.sendMail({
            
            from: 'admin@gmail.com',
            to: email.email,
            subject: "Please verify your mail",
            text: "To verify your account",
            html: '<html><body><p>To verify your account</p><a href="http://localhost:4200/login?token=' +token+
            '">Click here</a></body></html>',            
        })
        .then((result) => {;
            console.log(result);
            console.log("email sent");
            
        })
        .catch((error) => {
            console.log(error);
            console.log("email not sent");
        });

    }
    async sendMailToPassword(email:any, token:any){
        await this.transport.sendMail({
            from: 'admin@gmail.com',
            to: email.email,
            subject: "Please verify your mail",
            text: "To verify your account",
            html: '<html><body><p>To verify your account</p><a href="http://localhost:4200/password?token=' +token+
            '">Click here</a></body></html>',            
        });
    }
//thorttling
async  getCurrentTime():Promise<string> {
    const now: Date = new Date(); // Get the current date and time
    const hours: number = now.getHours(); // Get the current hour (0-23)
    const minutes: number = now.getMinutes(); // Get the current minute (0-59)
    const seconds: number = now.getSeconds(); // Get the current second (0-59)
    // Format the time as HH:MM:SS
    const formattedTime= `${this.padZero(minutes)}:${this.padZero(seconds)}`;
    return formattedTime;
}
async padZero(value: number) :Promise<string>{
    return value.toString().padStart(2, '0');
}
}

