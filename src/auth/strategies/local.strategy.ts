import { PassportStrategy } from "@nestjs/passport";
import {Strategy} from 'passport-local';
import { AuthService } from "../auth.service";
import { ExceptionBuilder } from "src/util/exception-builder.utils";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService){
        super({
            usernameField: 'email',
            passwordField: 'password'
        });
    }

    async validate(email: string, password: string){
        const user = await this.authService.validateUserCredential(email, password);
        if(!user){
            throw ExceptionBuilder.build("Invalid email or password", 401);
        }

        return user;
    }
}