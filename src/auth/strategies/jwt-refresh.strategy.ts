import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { createExtractJwtFromCookie } from "src/util/extract-jwt-cookie.utils";

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
            jwtFromRequest: createExtractJwtFromCookie('refresh_token'),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: any){
        return payload;
    }
}