import { Injectable } from "@nestjs/common";
import { Prisma, Product, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserReturnDto } from "./dto/user-return.dto";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async createUser(data: Prisma.UserCreateInput) {

        let hashedPassword = bcrypt.hashSync(data.password, parseInt(process.env.SALT_ROUNDS));
        data.password = hashedPassword;

        const newUser = await this.prisma.user.create({
            data,
            include: {
                role: true,
            }
        });

        let userResponse = UserReturnDto.from(newUser);
        userResponse.role = newUser.role;

        return userResponse;
    }
}