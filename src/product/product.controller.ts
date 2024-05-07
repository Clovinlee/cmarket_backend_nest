import { Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "./product.service";
import { SearchProductDTO } from "src/dto/product/search-product.dto";

@Controller("/api/products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findProducts(@Query() query: SearchProductDTO) {
        // formatting done inside DTO
        return this.productService.searchProduct(query);
    }
}