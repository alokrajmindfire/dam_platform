import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const data = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: { worker: 'running' },
  };
  const response = new ApiResponse(200, data, 'Service is healthy');
  return res.status(response.statusCode).json(response);
});
