import { Injectable } from "@nestjs/common";
import { Prisma, Product } from "@prisma/client";
import { CreateProductDto } from "src/product/dto/create-product.dto";
import { SearchProductDTO } from "src/product/dto/search-product.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { }

    async searchProduct(query: SearchProductDTO) {

        let listProducts: Product[];

        let nameQuery = [];
        for (let name of query.name.split(" ")) {
            nameQuery.push({
                name: {
                    "contains": name,
                    mode: "insensitive",
                }
            })
        }

        let priceQuery = [];
        
        if (Number.isNaN(query.minPrice) == false) {
            priceQuery.push({
                price: {
                    "gte": query.minPrice
                }
            })
        }
        if (Number.isNaN(query.maxPrice) == false) {
            priceQuery.push({
                price: {
                    "lte": query.maxPrice
                }
            })
        }

        listProducts = await this.prisma.product.findMany({
            take: query.pagesize,
            skip: (query.page - 1) * query.pagesize,
            where: {
                AND: [
                    ...nameQuery,
                    ...priceQuery,
                    {
                        OR: [
                            query.rarity != null && query.rarity.length != 0 ? { id_rarity: { in: query.rarity } } : {},
                            query.merchant != null && query.merchant.length != 0 ? {
                                ProductOnMerchant: {
                                    some: {
                                        id_merchant: {
                                            in: query.merchant
                                        }
                                    }
                                },
                            } : {},
                        ]
                    }

                ],
            },
            include: {
                rarity: true
            },
            orderBy: {
                id: "asc",
            }
        })

        let totalProductCount: number = await this.prisma.product.count();
        return {
            "pagination": {
                "page": query.page,
                "pageSize": query.pagesize,
                "totalPages": Math.ceil(totalProductCount / query.pagesize),
            },
            "products": listProducts,
        }


        // return this.prisma.product.findMany();
    }

    async createProduct(data: Prisma.ProductCreateInput) {
        return this.prisma.product.create({
            data,
            include: {
                rarity: true
            }
        });
    }
}