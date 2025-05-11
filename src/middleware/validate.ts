import Ajv from 'ajv';
import { Request, Response } from 'express';
import { Middleware, Schema } from '../types';

const ajv = new Ajv({ allErrors: true });
export function validate<T>(schema: Schema): Middleware<T> {
  return async (req: Request, res: Response, next) => {
    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    if (!valid) {
      // Check for errors related to required properties or type mismatches
      const error = validate.errors?.find(
        (err) =>
          (err.keyword === 'required' && err.params.missingProperty) ||
          (err.keyword === 'type' && err.instancePath)
      );

      if (error) {
        let propertyName: string;
        if (error.keyword === 'required') {
          propertyName = error.params.missingProperty;
        } else {
          // Extract property name from instancePath (e.g., "/name" -> "name")
          propertyName = error.instancePath.replace(/^\//, '');
        }

        res.status(400).json({
          error: 'Validation failed',
          details: `${propertyName} is required`,
        });
        return;
      }

      // Fallback for other validation errors
      res.status(400).json({
        error: 'Validation failed',
        details: validate.errors?.map((err) => err.message).join(', '),
      });
      return;
    }
    next();
  };
}
