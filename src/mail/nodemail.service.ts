import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail, { Address } from 'nodemailer/lib/mailer';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { handlebarTemplate } from 'src/util/handlebar-templater.utilts';
import { IMailerService } from './interface/mailer.interface';
import { SendMailDto } from './dto/send-mail.dto';
import * as path from 'path';
import { EmailRegister } from '@prisma/client';

@Injectable()
export class NodemailerService implements IMailerService{

    constructor(private prisma: PrismaService) { }
    
    generateMailoptions(body: SendMailDto) {
        const mailoptions: Mail.Options ={
            from: body.from,
            to: body.recipient,
            subject: body.subject,
            html: body.html,
            text: body.text ?? "",
            attachments: body.attachments ?? [],
        }
        return mailoptions;
    }
    generateMailTransporter(host: string = process.env.MAIL_HOST, port: any = process.env.MAIL_PORT, auth: Record<string,string> = {user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD}) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: host ?? "noreply@"+process.env.APP_NAME,
            port: Number(port) ?? 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: auth,
        });
        
        return transporter;
    }
    
    // HTML TEMPLATE
    // buttonRedirect
    // linkRedirect
    // appUrl
    async sendMail(email: string, title: string|null, from: Record<string, string>|null) {
        const uuid: string = uuidv4();
    
        // Mail
        const recipient: Address = { name: "", address: email };
        const subject = title ?? "Email Registration Confirmation";
        const mailUrl = process.env.API_URL + "/email/confirm/" + uuid;

        const placeHolderReplacements: Record<string, string> = { buttonRedirect: mailUrl, linkRedirect: mailUrl, appUrl: process.env.APP_URL }
        //

        // HTML TEMPLATE
        const htmlToSend:string = handlebarTemplate(placeHolderReplacements);
        //

        const transporter = this.generateMailTransporter();
        
        const fromAddress: Address = from == null ? {name: process.env.APP_NAME, address: process.env.DEFAULT_MAIL_FROM} : {name: from.name, address: from.address};

        const imageTemplatePath = path.resolve() + "/src/mail/template/images/"
        const mailAttachment = [{
            filename: 'email-icon.png',
            path: imageTemplatePath + 'email-icon.png',
            cid: 'email-icon'
        },
        {
            filename: 'logo.png',
            path: imageTemplatePath + 'logo.png',
            cid: 'logo'
        },
        {
            filename: 'fb-logo.png',
            path: imageTemplatePath + 'fb-logo.png',
            cid: 'fb-logo'
        },
        {
            filename: 'in-logo.png',
            path: imageTemplatePath + 'in-logo.png',
            cid: 'in-logo'
        },
        {
            filename: 'twitter-logo.png',
            path: imageTemplatePath + 'twitter-logo.png',
            cid: 'twitter-logo'
        }
        ];

        const mailOptions: SendMailDto = new SendMailDto(fromAddress, [recipient], subject, htmlToSend, "Thank you for registering to our website. Please visit this link to activate your account: " + mailUrl, placeHolderReplacements,mailAttachment);
        const options: Mail.Options = this.generateMailoptions(mailOptions);

        const exist: EmailRegister = await this.prisma.emailRegister.findFirst({
            where: {
                email: email
            }
        });

        const maxExpiry: number = parseInt(process.env.MAIL_CONFIRMATION_EXPIRY.toString()); //3600 second
        const expiry_date: Date = new Date(new Date().getTime() + 1000 * maxExpiry); // now + 1 hour

        return await this.prisma.$transaction(async (pr) => {
            try {
                if(!exist){
                    await pr.emailRegister.create({
                        data: {
                            email: email,
                            uuid: uuid,
                            email_confirm: false,
                            email_confirm_date: null,
                            expiry_at: expiry_date,
                        }
                    })
                }else{
                    await pr.emailRegister.update({
                        where: {
                            id: exist.id,
                        },
                        data: {
                            uuid: uuid,
                            email_confirm: false,
                            email_confirm_date: null,
                            expiry_at: expiry_date,
                        }
                    })
                }

                // send mail
                await transporter.sendMail(options);
                return mailUrl;
            } catch (error) {
                console.log(error);
                throw ExceptionBuilder.build("Failed to send email", 500);
            }
        }, {timeout:20000});
    }
    
    
}
