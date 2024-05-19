import { Body, Controller, Get, HttpCode, HttpException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchProductDTO } from "src/product/dto/search-product.dto";
import { Prisma } from "@prisma/client";
import { CreateProductDto } from "src/product/dto/create-product.dto";
import { ExceptionBuilder } from "src/util/exception-builder.utils";
import { log } from "console";

@Controller("/products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @HttpCode(200)
    @Get("merchantfilters")
    async getMerchantFilters(){
        return this.productService.getMerchantFilters();
    }

    @HttpCode(200)
    @Get("rarityfilters")
    async getRarityFilters(){
        return this.productService.getRarityFilters();
    }

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
                throw ExceptionBuilder.build("Invalid Rarity ID", 404);
            }else{
                log(error);
                throw ExceptionBuilder.build("Internal Server Error", 500);
            }
        }
    }
}