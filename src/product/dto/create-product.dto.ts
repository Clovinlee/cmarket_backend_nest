import { IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @IsNotEmpty()
  @Min(1)
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  image: string;

  @IsNotEmpty()
  id_rarity: number;
}