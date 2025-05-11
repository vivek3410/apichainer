import { NextFunction, Request, Response } from 'express';
import { Middleware } from '../types';

export function auth<T>(options: {
  token: string;
  header?: string;
}): Middleware<T> {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers[options.header || 'authorization'];
    if (authHeader === `Bearer ${options.token}`) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
}
