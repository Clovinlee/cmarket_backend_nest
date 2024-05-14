import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
import { IMailerService, IMailerServiceSymbol } from './interface/mailer.interface';

@Controller('mail')
export class MailController {

    constructor(@Inject(IMailerServiceSymbol) private mailService: IMailerService){} 

    @Get("confirm/:uuid")
    async confirmMail(@Param("uuid") uuid: string) {
        return "Your UUID is : "+uuid;
    }

    @HttpCode(HttpStatus.OK)
    @Post("send")
    async sendMail(@Body("email") email) {
        if(email == null || email == undefined){
            throw ExceptionBuilder.build("Email is required", HttpStatus.BAD_REQUEST);
        }
        const mailUrl = await this.mailService.sendMail(email, null, null);
        
        return {"message":mailUrl};
    }
}
