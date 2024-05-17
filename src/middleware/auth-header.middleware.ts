import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers.authorization = `Bearer ${req.cookies.access_token}`;
    next();
  }
}
