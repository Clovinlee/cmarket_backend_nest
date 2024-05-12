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

    toJson(): Record<string, any> {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            id_role: this.id_role,
            role: {
                id: this.role.id,
                name: this.role.name,
                level: this.role.level,
            },
        };
    }
    
}