import { Prisma, Role, User } from "@prisma/client";

export class UserReturnDto {
    id: number;
    name: string;
    email: string;
    id_role: number;
    role: Role;

    constructor(id: number, name: string, email: string, id_role: number){
        this.id = id;
        this.name = name;
        this.email = email;
        this.id_role = id_role;
    }

    static from(dto: User): UserReturnDto {
        return new UserReturnDto(
            dto.id,
            dto.name,
            dto.email,
            dto.id_role,
        );
    }
}