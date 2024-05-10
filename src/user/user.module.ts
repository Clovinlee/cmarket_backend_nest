import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { IsEmailExist } from "src/validation/email-exist.validation";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, IsEmailExist],
  })
  export class UserModule { }
  