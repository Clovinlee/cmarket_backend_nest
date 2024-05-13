import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';
import Mail from 'nodemailer/lib/mailer';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
import {v4 as uuidv4} from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';

@Injectable()
export class MailService {

    mailTransport(){
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST ?? "noreply@localhost",
            port: Number(process.env.MAIL_PORT) ?? 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
            },
          });

          return transporter;
    }

    // HTML TEMPLATE
    // buttonRedirect
    // linkRedirect
    // appUrl

    async sendMail(body: SendMailDto) {
        const uuid: string = uuidv4();

        const htmlTemplatePath = path.resolve()+"/src/mail/template/index.html";
        const imageTemplatePath = path.resolve()+"/src/mail/template/images/";
        
        const source:string = fs.readFileSync(htmlTemplatePath, 'utf8').toString();

        const template = Handlebars.compile(source);
        
        const htmlToSend = template(body.placeHolderReplacements);


        const transporter = this.mailTransport();

        const options: Mail.Options = {
            from: body.from ?? {
                name: process.env.APP_NAME,
                address: process.env.DEFAULT_MAIL_FROM,
            },
            to: body.recipient,
            subject: body.subject,
            html: htmlToSend,
            attachments: [{
                filename: 'email-icon.png',
                path: imageTemplatePath+'email-icon.png',
                cid: 'email-icon'
            },
            {
                filename: 'logo.png',
                path: imageTemplatePath+'logo.png',
                cid: 'logo'
            },
            {
                filename: 'fb-logo.png',
                path: imageTemplatePath+'fb-logo.png',
                cid: 'fb-logo'
            },        
            {
                filename: 'in-logo.png',
                path: imageTemplatePath+'in-logo.png',
                cid: 'in-logo'
            },
            {
                filename: 'twitter-logo.png',
                path: imageTemplatePath+'twitter-logo.png',
                cid: 'twitter-logo'
            }
        ],
            text: "This is just a sample of text version of the email",
        }

        try {
            const result = await transporter.sendMail(options);
            return result;
        } catch (error) {
            console.log(error);
            throw ExceptionBuilder.build("Failed to send email", 500);
        }
    }
}
