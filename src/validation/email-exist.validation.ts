import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExceptionBuilder } from 'src/util/exception-builder.utils';
  
  @ValidatorConstraint({name:"IsEmailExist", async: true })
  @Injectable()
  export class IsEmailExist implements ValidatorConstraintInterface {
    constructor(private prismaService: PrismaService) {}
    async validate(email: any, args: ValidationArguments) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            throw ExceptionBuilder.build(`${args.property} ${args.value} is already taken`, HttpStatus.CONFLICT);
            // throw new BadRequestException(`${args.property} ${email} is already taken`, '409');
            // return false;
        }
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} ${args.value} is already taken`;
      }
  }