import { Body, Controller, Get, HttpCode, HttpException, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchProductDTO } from "src/product/dto/search-product.dto";
import { Prisma, Product } from "@prisma/client";
import { CreateProductDto } from "src/product/dto/create-product.dto";
import { ExceptionBuilder } from "src/util/exception-builder.utils";
import { log } from "console";

@Controller("/products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}
    
    @HttpCode(200)
    @Get(":slug")
    async getProductDetails(@Param("slug") slug: string) {
        // [ID, NAME ]
        const productSlug = slug.split("-");
        if(productSlug.length != 2) throw ExceptionBuilder.build("Invalid Product Slug", 400);
        if(isNaN(parseInt(productSlug[0]))) throw ExceptionBuilder.build("Invalid Product ID", 400);

        const product: Product|null = (await this.productService.getProductDetails(parseInt(productSlug[0]), productSlug[1]));
        if(product){
            return product;
        }
        throw ExceptionBuilder.build("Product Not Found", 404);
    }

    @HttpCode(200)
    @Get("filters/merchantfilters")
    async getMerchantFilters(){
        return this.productService.getMerchantFilters();
    }

    @HttpCode(200)
    @Get("filters/rarityfilters")
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