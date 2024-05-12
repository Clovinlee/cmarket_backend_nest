import { Injectable } from "@nestjs/common";
import { Prisma, Product, Role, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from 'bcrypt';
import { UserReturnDto } from "./dto/user-return.dto";
import { UserLoginDto } from "./dto/user-login.dto";

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    async getUserByEmail(email: string): Promise<User> {
        let user = await this.prisma.user.findFirst({
            where: {
                email: email
            },
            include: {
                role: true
            }
        });

        if (user) {
            return user;
        }

        return null;
    }

    async getUserRole(user: User): Promise<Role>
    async getUserRole(user: number): Promise<Role> 
    async getUserRole(user: number | User): Promise<Role> {
        let userId = typeof user === 'number' ? user : user.id;

        let userData = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                role: true
            }
        });

        if (user) {
            return userData.role;
        }

        return null;
    }

    async createUser(data: Prisma.UserCreateInput) {

        let hashedPassword = bcrypt.hashSync(data.password, parseInt(process.env.SALT_ROUNDS));
        data.password = hashedPassword;

        const newUser = await this.prisma.user.create({
            data,
            include: {
                role: true,
            }
        });

        return newUser;
    }
}