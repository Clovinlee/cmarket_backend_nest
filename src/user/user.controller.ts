import { Body, Controller, HttpCode, Param, Post, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Response } from "express";
import { ExceptionBuilder } from "src/util/exception-builder.utils";
import { UserReturnDto } from "./dto/user-return.dto";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("test")
    @UseGuards(JwtAuthGuard)
    async test(){
        return "Yo MacD!";
    }

    @HttpCode(200)  
    @Post(":uuid/email")
    async checkUuid(@Param("uuid") uuid: string, @Res() res: Response){
        let user = await this.userService.getUserRegistrationByUuid(uuid);
        const userEmail = user.email ?? "";
        let userAccount = await this.userService.getUserByEmail(userEmail);
        if(userAccount){
            // User already registered
            res.redirect("http://localhost:3000/login");
            return;
        }
        return res.json({"emailregister": userEmail});
    }

    @HttpCode(200)
    @Post("/email")
    async getUsetByEmail(@Body("email") email: string){
        if(email == "" || email == null){
            throw ExceptionBuilder.build("Email is required", 400);
        }
        let user = await this.userService.getUserByEmail(email);
        if(!user){
            throw ExceptionBuilder.build("User not found", 404);
        }
        return UserReturnDto.from(user);
    }
}