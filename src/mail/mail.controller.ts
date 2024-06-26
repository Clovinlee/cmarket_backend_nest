import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Res } from '@nestjs/common';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
import { IMailerService, IMailerServiceSymbol } from './interface/mailer.interface';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@Controller('email')
export class MailController {

    constructor(@Inject(IMailerServiceSymbol) private mailService: IMailerService, private userService: UserService) { }

    @HttpCode(200)
    @Get("confirm/:uuid")
    async confirmMail(@Param("uuid") uuid: string, @Res() res: Response) {
        let user = await this.userService.getUserRegistrationByUuid(uuid);
        if (user == null) {
            throw ExceptionBuilder.build("Invalid uuid", HttpStatus.NOT_FOUND);
        } else if (user.email_confirm == true) {
            let userRegistered = await this.userService.getUserByEmail(user.email);
            // means user email is already CONFIRMED & registered in DB
            if (userRegistered != null) {
                return res.redirect(process.env.APP_URL + "/login");
            }else{
                // Email already CONFIRMED but user HAS NOT registered
                return res.redirect(process.env.APP_URL + "/verify/email/" + uuid);
            }
        }

        try {
            // Check expiry time based on ENV | 3600 default
            let expiryTime = user.expiry_at;
            let currentTime = new Date();


            if (expiryTime < currentTime) {
                res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Confirmation Expired</title></head><body><p>Email confirmation link has expired.</p><a href='${process.env.APP_URL}'>Go Back</a></body></html>`);

                return ExceptionBuilder.build("Email confirmation link has expired", HttpStatus.BAD_REQUEST);
            }


            // change CONFIRM email to TRUE and update date
            await this.userService.confirmUserRegistration(user.id);
            //
            return res.redirect(process.env.APP_URL + "/verify/email/" + uuid);
        } catch (error) {
            console.log(error);
            return ExceptionBuilder.build("Error confirming email", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @HttpCode(HttpStatus.OK)
    @Post("send")
    async sendMail(@Body("email") email: string) {
        if (email == null || email == undefined) {
            throw ExceptionBuilder.build("Email is required", HttpStatus.BAD_REQUEST);
        }

        // Check email validated / exist
        let user = await this.userService.getUserByEmail(email);
        if (user) {
            throw ExceptionBuilder.build("Email already registered", HttpStatus.CONFLICT);
        }

        console.log("Sending Mail to : " + email)
        const mailUrl = await this.mailService.sendMail(email, null, null);
        console.log("Sending Mail Complete");

        return { "message": mailUrl };
    }
}
