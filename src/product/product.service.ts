import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService{

    constructor(private prisma: PrismaService){}

    async searchProduct() {
        return this.prisma.product.findMany();
    }
}