import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchProductDTO } from "src/dto/product/search-product.dto";
import { Prisma } from "@prisma/client";
import { CreateProductDto } from "src/dto/product/create-product.dto";

@Controller("/api/products")
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
            price: parseFloat(createProductDto.price),
            image: createProductDto.image,
            rarity: {
                connect: {
                    id: parseInt(createProductDto.id_rarity)
                }
            }
        }

        return this.productService.createProduct(createInput);
    }
}