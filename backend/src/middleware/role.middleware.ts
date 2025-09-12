import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const requireAdmin = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(new ApiError(401, 'Unauthorized'));
  if (req.user.role !== 'admin')
    return next(new ApiError(403, 'Forbidden: Admins only'));
  next();
};
