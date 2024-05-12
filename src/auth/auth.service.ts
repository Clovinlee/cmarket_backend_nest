import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Prisma, Role, User } from '@prisma/client';
import { UserReturnDto } from 'src/user/dto/user-return.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService){}

    async validateUserCredential(email: string, password: string){
        const user = await this.userService.getUserByEmail(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }

        return null;
    }

    async login(user: any){
        let payload = UserReturnDto.from(user);
        payload.role = user.role;

        return {
            user: payload,
            access_token: this.jwtService.sign(payload.toJson()),
            refresh_token: this.jwtService.sign(payload.toJson(), {expiresIn: "7d"})
        };
    }

    async register(data: Prisma.UserCreateInput){
        let user = await this.userService.createUser(data);
        return UserReturnDto.from(user);
    }

    async refreshToken(user: any){
        let payload = UserReturnDto.from(user);
        payload.role = user.role; 

        return {
            user: payload,
            access_token: this.jwtService.sign(payload.toJson()),
        };
    }

}
