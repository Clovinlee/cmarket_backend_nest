import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { SearchProductDTO } from "src/dto/product/search-product.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductService {

    constructor(private prisma: PrismaService) { }

    async searchProduct(query: SearchProductDTO) {

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

        return this.prisma.product.findMany({
            take: query.pagesize,
            skip: (query.page - 1) * query.pagesize,
            where: {
                AND: [
                    ...nameQuery,
                    ...priceQuery,
                    {
                        idRarity: {
                            in: query.rarity
                        }
                    },
                    {
                        ProductOnMerchant: {
                            some: {
                                idMerchant: {
                                    in: query.merchant
                                }
                            }
                        },
                    }
                ]
            },
            orderBy: {
                id: "asc",
            }
        })

        // return this.prisma.product.findMany();
    }
}