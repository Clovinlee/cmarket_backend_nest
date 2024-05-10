import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  emailConfirm: boolean;

}