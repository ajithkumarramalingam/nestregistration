import { Injectable } from '@nestjs/common';    
import * as nodemailer from 'nodemailer';


@Injectable()
export class MailerService {

    private transport: nodemailer.Transporter;
    constructor() {
        this.transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "b383712716b606",
                  pass: "4582315b8c338d",
                },
                });
    }
    async sendMail(email:any, token:any){
        await this.transport.sendMail({
            from: 'admin@gmail.com',
            to: email.email,
            subject: "Please verify your mail",
            text: "To verify your account",
            html: '<html><body><p>To verify your account</p><a href="http://localhost:4200/login?token=' +token+
            '">Click here</a></body></html>',            
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

}