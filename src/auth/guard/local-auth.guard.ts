import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Exception } from "handlebars";
import { Observable } from "rxjs";
import { ExceptionBuilder } from "src/util/exception-builder.utils";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if(err || !user){
            console.log("Error at local auth guard", err, user, info);
            throw ExceptionBuilder.build("Invalid email or password", 401);
        }

        return user;
    }
}