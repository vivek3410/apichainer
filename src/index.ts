import Ajv from 'ajv';
import { Request, Response } from 'express';
import { auth } from './middleware/auth';
import { log } from './middleware/log';
import { validate } from './middleware/validate';
import { ChainConfig, Middleware, Schema } from './types';

const ajv = new Ajv({ allErrors: true });

export class APIChainer<T = any> {
  private middlewares: Middleware<T>[] = [];
  private config: ChainConfig<T>;

  constructor(context: T = {} as T, parallel: boolean = false) {
    this.config = { context, parallel };
  }

  use(middleware: Middleware<T>): this {
    this.middlewares.push(middleware);
    return this;
  }

  validate(schema: Schema): this {
    this.use(validate(schema));
    return this;
  }

  auth(options: { token: string; header?: string }): this {
    this.use(auth(options));
    return this;
  }

  log(options: { level?: 'info' | 'warn' | 'error' } = {}): this {
    this.use(log(options));
    return this;
  }

  async execute(req: Request, res: Response): Promise<void> {
    let index = 0;
    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(req, res, next, this.config.context);
      }
    };

    if (this.config.parallel) {
      await Promise.all(
        this.middlewares.map((mw) =>
          mw(req, res, () => Promise.resolve(), this.config.context)
        )
      );
    } else {
      await next();
    }
  }
}

export default APIChainer;
