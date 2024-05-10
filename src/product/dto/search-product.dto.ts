import { Expose, Transform } from "class-transformer";

export class SearchProductDTO{
    name: string = "";

    @Expose({ name: "page" })
    @Transform(({ value }) => parseFloat(value) == value ? parseFloat(value) : 1)
    page: number = 1;

    @Expose({ name: "pagesize" })
    @Transform(({ value }) => parseFloat(value) == value ? parseFloat(value) : 10)
    pagesize: number = 10;

    @Expose({ name: "minprice" })
    @Transform(({ value }) => parseFloat(value) == value ? parseFloat(value) : NaN)
    minPrice?: number;

    @Expose({ name: "maxprice" })
    @Transform(({ value }) => parseFloat(value) == value ? parseFloat(value) : NaN)
    maxPrice?: number;
    
    @Transform(({ value }) => value.toString().split(",").map((val: string) => Number.parseFloat(val)))
    rarity?: number[];
    
    @Transform(({ value }) => value.toString().split(",").map((val: string) => Number.parseFloat(val)))
    merchant?: number[];
}