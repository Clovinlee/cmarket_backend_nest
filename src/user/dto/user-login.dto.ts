import { PickType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserLoginDto{
    
    @IsEmail()
    email: string;
    
    password: string;
}