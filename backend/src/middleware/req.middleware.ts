import { ZodTypeAny } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateResource =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors,
      });
    }
  };
