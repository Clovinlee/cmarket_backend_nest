import { Injectable } from "@nestjs/common";
import { Prisma, Product } from "@prisma/client";
import { CreateProductDto } from "src/product/dto/create-product.dto";
import { SearchProductDTO } from "src/product/dto/search-product.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { }

    async getProductDetails(id: number, name: string) {
        return this.prisma.product.findUnique({
            where: {
                id:id,
                name: {
                    equals: name.toLowerCase(),
                    mode: "insensitive",
                },
            },
            include: {
                rarity: true
            }
        });
    }

    async searchProduct(query: SearchProductDTO) {
        // console.log(query);
        // console.log("====================================");
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

        let queryWhere = {
            AND: [
                ...nameQuery,
                ...priceQuery,
                {
                    AND: [
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
        };

        let totalProducts = await this.prisma.product.count({
            where: queryWhere
        });

        listProducts = await this.prisma.product.findMany({
            take: query.pagesize == 0 ? 1 : query.pagesize,
            skip: (query.page - 1) * query.pagesize,
            where: queryWhere,
            include: {
                rarity: true
            },
            orderBy: {
                id: "asc",
            }
        })

        return {
            "pagination": {
                "page": query.page,
                "pageSize": query.pagesize,
                "totalPages": Math.ceil(totalProducts / query.pagesize),
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

    async getMerchantFilters(){
        return this.prisma.merchant.findMany();
    }

    async getRarityFilters(){
        return this.prisma.rarity.findMany();
    }
}