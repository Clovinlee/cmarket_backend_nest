import { Controller, Get, Param, Post } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';
import { link } from 'fs';

@Controller('mail')
export class MailController {

    constructor(private mailService: MailService){} 

    @Get("confirm/:uuid")
    async confirmMail(@Param("uuid") uuid: string) {
        return "Your UUID is : "+uuid;
    }

    @Post("send")
    async sendMail() {
        let body:SendMailDto = {
            recipient: [{name:"MxZero", address: "mxzeromxzero6@gmail.com "}],
            subject: "Hello Subject Mail",
            html: "<h1>Hello Mail</h1>",
            text: "YO MAMA",
            placeHolderReplacements: {buttonRedirect: "http://linkButtonRedirect", linkRedirect: "http://linkRedirect", appUrl: process.env.APP_NAME}
        };

        return await this.mailService.sendMail(body);
    }
}
