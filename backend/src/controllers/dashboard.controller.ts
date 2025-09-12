import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { DashboardService } from 'src/services/dashboard.service';

export const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await DashboardService.getStats();
    return res.json(
      new ApiResponse(200, stats, 'Dashboard stats fetched successfully'),
    );
  },
);
