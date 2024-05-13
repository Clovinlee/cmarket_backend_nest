import { Address } from "nodemailer/lib/mailer";

class SendMailDto {
    public from?: Address;
    public recipient: Address[];
    public subject: string;
    public html: string;
    public text?: string;
    public placeHolderReplacements?: Record<string, string>;

    constructor(from: Address, recipient: Address[], subject: string, html: string, text: string, placeHolderReplacements: Record<string, string>) {
        this.from = from;
        this.recipient = recipient;
        this.subject = subject;
        this.html = html;
        this.text = text;
        this.placeHolderReplacements = placeHolderReplacements;
    }
}

export {SendMailDto};