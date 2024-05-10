import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, Min, MinLength, Validate, isEmail } from "class-validator";
import { IsEmailExist } from "src/validation/email-exist.validation";
import { MinimalUppercaseValidator } from "src/validation/minimal-uppercase.validation";
import { SameValueAsValidator } from "src/validation/same-field.validation";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(100)
  @IsEmail()
  @Validate(IsEmailExist)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @Validate(MinimalUppercaseValidator, [1])
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(SameValueAsValidator, ['password'])
  confirmPassword: string;

  id_role: number = 2;
}