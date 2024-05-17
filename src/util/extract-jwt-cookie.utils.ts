import { Request } from 'express';

export function createExtractJwtFromCookie(cookieName: string) {
  return function extractJwtFromCookie(req: Request): string | null {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[cookieName];
    }
    return token;
  }
}