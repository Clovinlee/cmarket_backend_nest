import { Body, Controller, Get, HttpException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Prisma } from "@prisma/client";

@Controller("/products")
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Post()
    @UsePipes(new ValidationPipe({skipMissingProperties: false, transform: true}))
    async createUser(@Body() createUserDto : CreateUserDto){
        
    }

}