import { Body, Controller, Get, HttpException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma } from "@prisma/client";
import { connect } from "http2";
import { log } from "console";

@Controller("/users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Post()
    @UsePipes(new ValidationPipe({skipMissingProperties: false, transform: true}))
    async createUser(@Body() createUserDto : CreateUserDto){
        let createInput :Prisma.UserCreateInput = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            email_confirm: false,
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
                throw new HttpException("Invalid Role ID", 404);
            }else{
                log(error);
                throw new HttpException("Internal Server Error", 500);
            }
        }
    }

}