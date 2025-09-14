import { getDashboardOverview } from '../../src/controllers/dashboard.controller';
import { DashboardService } from '../../src/services/dashboard.service';
import { ApiResponse } from '../../src/utils/ApiResponse';

jest.mock('../../src/services/dashboard.service');

describe('DashboardController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getDashboardOverview', () => {
    it('should fetch dashboard stats successfully', async () => {
      const mockStats = {
        totalAssets: 10,
        uploads: 5,
        downloads: 3,
      };

      (DashboardService.getStats as jest.Mock).mockResolvedValue(mockStats);

      await getDashboardOverview(mockReq, mockRes, jest.fn());

      expect(DashboardService.getStats).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, mockStats, 'Dashboard stats fetched successfully')
      );
    });
  });
});
