import { Body, Controller, Get, HttpCode, HttpException, Param, Post, Put, Query, Session, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma } from "@prisma/client";
import { log } from "console";
import { ExceptionBuilder } from "src/util/exception-builder.utils";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("test")
    @UseGuards(JwtAuthGuard)
    async test(){
        return "Yo MacD!";
    }

    @HttpCode(200)  
    @Post("uuid/email")
    async getSession(@Session() session: Record<string, any>, @Body("uuid") uuid: string){
        // let user = await this.userService.getUserRegistrationByUuid(uuid);
        return {emailregister: session.emailregister};
    }

    
    @HttpCode(201)
    @Post("new")
    @UsePipes(new ValidationPipe({skipMissingProperties: false, transform: true}))
    async createUser(@Session() session: Record<string, any>, @Body() createUserDto : CreateUserDto){

        if(session.email == null || session.email == undefined || session.email != createUserDto.email){
            return ExceptionBuilder.build("Invalid Session", 401);
        } 

        let createInput :Prisma.UserCreateInput = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            role: {
                connect:{
                    id: createUserDto.id_role,
                }
            }
        };

        try {
            return await this.userService.createUser(createInput);
        } catch (error) {
            if(error.code == "P2025"){
                throw ExceptionBuilder.build("Invalid Role ID", 404);
            }else{
                log(error);
                throw ExceptionBuilder.build("Internal Server Error", 500);
            }
        }
    }

}