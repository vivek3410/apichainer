import { NextFunction, Request, Response } from 'express';

export function log<T>(options: { level?: 'info' | 'warn' | 'error' } = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    console[options.level || 'info'](
      `[${new Date().toISOString()}] ${req.method} ${req.url}`
    );
    next();
  };
}
