import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  @IsNumberString()
  id_rarity: string;
}