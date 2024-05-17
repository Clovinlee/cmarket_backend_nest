import { Body, Controller, HttpCode, Post, Request, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
import { log } from 'console';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request as ExpressRequest, Response } from 'express';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(200)
    @Post('login')
    @UseGuards(LocalAuthGuard) 
    async login(@Request() req: ExpressRequest, @Res() res: Response){
        let payload = await this.authService.login(req.user);
        res.cookie('access_token', payload.access_token, {httpOnly:true});
        res.cookie('refresh_token', payload.refresh_token, {httpOnly:true});
        return res.send({user: payload.user});
    }
    
    @HttpCode(200)
    @Post("self")
    @UseGuards(JwtAuthGuard)
    async authSelf(@Request() req: ExpressRequest){
        return {"user":req.user};
    }

    @HttpCode(200)
    @Post('refresh')
    @UseGuards(JwtRefreshAuthGuard)
    async refreshToken(@Request() req: ExpressRequest, @Res() res: Response){
        let payload = await this.authService.refreshToken(req.user);
        res.cookie('access_token', payload.access_token, {httpOnly: true});

        return res.send({message: "JWT Token Refreshed"});
    }

    @HttpCode(201)
    @Post('register')
    @UsePipes(new ValidationPipe({skipMissingProperties: false, transform: true}))
    async register(@Body() createUserDto: CreateUserDto){

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
            return await this.authService.register(createInput);
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
