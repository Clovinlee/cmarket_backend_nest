import { SendMailDto } from "../dto/send-mail.dto";

export interface IMailerService{
    generateMailoptions(body: SendMailDto): any;
    generateMailTransporter(): any;
    sendMail(email: string, title: string|null, from: Record<string, string>|null): any;
}

export const IMailerServiceSymbol = Symbol("IMailerServiceSymbol");