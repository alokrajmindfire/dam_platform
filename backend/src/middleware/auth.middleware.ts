import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models/user.model';
import { Request } from 'express';

export const verifyJWT = asyncHandler(
  async (req: Request & { user?: IUser }, _, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

      console.log(token);
      if (!token) {
        throw new ApiError(401, 'Unauthorized request');
      }
      const secret = process.env.ACCESS_TOKEN_SECRET;

      if (!secret) {
        throw new ApiError(500, 'ACCESS_TOKEN_SECRET is not defined');
      }

      const decodedToken = jwt.verify(token, secret);

      if (typeof decodedToken == 'string' || !('_id' in decodedToken)) {
        throw new ApiError(401, 'Invalid Access Token');
      }
      const user = await User.findById(decodedToken?._id).select('-password');

      if (!user) {
        throw new ApiError(401, 'Invalid Access Token');
      }

      req.user = user;
      next();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ApiError(401, error.message);
      }
      throw new ApiError(401, 'Invalid access token');
    }
  },
);
