import { NextFunction, Request, Response } from 'express';

export type Middleware<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction,
  context: T
) => Promise<void> | void;

export interface ChainConfig<T> {
  context: T;
  parallel?: boolean;
}

enum Type {
  'object',
}

export type JsonSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'object'
  | 'array'
  | 'boolean'
  | 'null';

export interface Schema {
  type: JsonSchemaType | JsonSchemaType[];
  properties?: { [key: string]: Schema };
  required?: string[];
  items?: Schema | Schema[];
}
