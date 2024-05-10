import { Body, Controller, Get, HttpException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchProductDTO } from "src/product/dto/search-product.dto";
import { Prisma } from "@prisma/client";
import { CreateProductDto } from "src/product/dto/create-product.dto";

@Controller("/products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findProducts(@Query() query: SearchProductDTO) {
        // formatting done inside DTO
        return this.productService.searchProduct(query);
    }

    @Post()
    @UsePipes(new ValidationPipe({skipMissingProperties: false, transform: true}))
    async createProduct(@Body() createProductDto : CreateProductDto){
        let createInput :Prisma.ProductCreateInput = {
            name: createProductDto.name,
            description: createProductDto.description,
            price: createProductDto.price,
            image: createProductDto.image,
            rarity: {
                connect: {
                    id: createProductDto.id_rarity,
                }
            }
        }

        try {
            return await this.productService.createProduct(createInput);
        } catch (error) {
            if(error.code == "P2025"){
                throw new HttpException("Rarity record not found", 404);
            }else{
                throw new HttpException("Internal Server Error", 500);
            }
        }
    }
}