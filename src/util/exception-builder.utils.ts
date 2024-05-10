import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ExceptionBuilder {

    static build(message: string[], statusCode: HttpStatus): HttpException;
    static build(message: string, statusCode: HttpStatus): HttpException;
    static build(message: string | string[] , statusCode: HttpStatus): HttpException {
        let messages = [];
        if(!Array.isArray(message)){
            message = [message];
        }

        message.map((msg) => {
            messages.push(msg);
        });

        return new HttpException({
            message: messages,
            error: HttpStatus[statusCode].toUpperCase().replace(" ", "_"),
            statusCode: statusCode,
        }, statusCode);
    }
}