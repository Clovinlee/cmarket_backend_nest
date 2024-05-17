import { ExecutionContext, Injectable } from "@nestjs/common";
import { JsonWebTokenError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { ExceptionBuilder } from "src/util/exception-builder.utils";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: any, status: any) {

        if (info instanceof JsonWebTokenError) {
            if(info.message == "jwt expired"){
            throw ExceptionBuilder.build("TOKEN_EXPIRED", 401);
            }
            throw ExceptionBuilder.build(info.message, 401);
        }
    
        return super.handleRequest(err, user, info, context, status);
      }
}