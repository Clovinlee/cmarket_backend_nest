import { Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller("/api/products")
export class ProductController {
    constructor(private readonly productService: ProductService) {}
  
    @Get()
    async findProducts(@Query() query) {
        return query;
    //   return this.productService.searchProduct();
    }
}