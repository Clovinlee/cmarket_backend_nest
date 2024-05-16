import { Controller, HttpCode, Param, Post, Res, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { Response } from "express";

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
}