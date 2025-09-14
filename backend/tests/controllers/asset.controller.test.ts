import {
  uploadAssets,
  getAssetsId,
  getAssets,
  updateAssetsDownloadCount,
  deleteAsset,
} from '../../src/controllers/assets.controller';
import { AssetService } from '../../src/services/assets.service';
import { ApiResponse } from '../../src/utils/ApiResponse';
import { Types } from 'mongoose';

jest.mock('../../src/services/assets.service');

describe('AssetController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {}, files: [], user: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('uploadAssets', () => {
    it('should return 404 if user not found', async () => {
      mockReq.user = null;
      mockReq.files = [{}];

      await uploadAssets(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User does not exist',
      });
    });

    it('should return 400 if no files provided', async () => {
      mockReq.user = { _id: new Types.ObjectId() };

      await uploadAssets(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No files provided' });
    });

    it('should upload assets successfully', async () => {
      mockReq.user = { _id: new Types.ObjectId() };
      mockReq.files = [{ originalname: 'file1' }, { originalname: 'file2' }];
      mockReq.body = { teamId: 'team1', channels: 'general,marketing' };

      (AssetService.uploadAsset as jest.Mock).mockImplementation((file, data) =>
        Promise.resolve({ file, data }),
      );

      await uploadAssets(mockReq, mockRes, jest.fn());

      expect(AssetService.uploadAsset).toHaveBeenCalledTimes(2);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.any(Array) }),
      );
    });
  });

  describe('getAssetsId', () => {
    it('should return 404 if user not found', async () => {
      mockReq.user = null;
      mockReq.params = { id: '1' };

      await getAssetsId(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User does not exist',
      });
    });

    it('should return 400 if no id provided', async () => {
      mockReq.user = { _id: new Types.ObjectId() };
      mockReq.params = {};

      await getAssetsId(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Asset ID required',
      });
    });

    it('should return asset URL successfully', async () => {
      mockReq.user = { _id: new Types.ObjectId() };
      mockReq.params = { id: 'asset1' };
      const mockAssetUrl = { url: 'http://example.com' };
      (AssetService.getAssetUrl as jest.Mock).mockResolvedValue(mockAssetUrl);

      await getAssetsId(mockReq, mockRes, jest.fn());

      expect(AssetService.getAssetUrl).toHaveBeenCalledWith('asset1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, mockAssetUrl, 'Asset retrieved'),
      );
    });
  });

  describe('getAssets', () => {
    it('should return 401 if user not found', async () => {
      mockReq.user = null;

      await getAssets(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should fetch assets successfully', async () => {
      const mockData = [{ id: '1' }];
      const mockTotal = 1;
      mockReq.user = { _id: new Types.ObjectId(), role: 'admin' };
      mockReq.query = { page: '1', limit: '5', search: '', filter: '' };
      (AssetService.getAssetsUrl as jest.Mock).mockResolvedValue({
        data: mockData,
        total: mockTotal,
      });

      await getAssets(mockReq, mockRes, jest.fn());

      expect(AssetService.getAssetsUrl).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, { assets: mockData, total: mockTotal }, 'Assets retrieved'),
      );
    });
  });

  describe('updateAssetsDownloadCount', () => {
    it('should increment download count successfully', async () => {
      mockReq.params = { id: 'asset1' };

      await updateAssetsDownloadCount(mockReq, mockRes, jest.fn());

      expect(AssetService.incrementDownloadCount).toHaveBeenCalledWith('asset1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, {}, 'Download count incremented'),
      );
    });
  });

  describe('deleteAsset', () => {
    it('should return 401 if user not found', async () => {
      mockReq.user = null;
      mockReq.params = { id: 'asset1' };

      await deleteAsset(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized',
      });
    });

    it('should return 404 if asset not found', async () => {
      mockReq.user = { _id: 'user1' };
      mockReq.params = { id: 'asset1' };
      (AssetService.delete as jest.Mock).mockResolvedValue(false);

      await deleteAsset(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Asset not found',
      });
    });

    it('should delete asset successfully', async () => {
      mockReq.user = { _id: 'user1' };
      mockReq.params = { id: 'asset1' };
      (AssetService.delete as jest.Mock).mockResolvedValue(true);

      await deleteAsset(mockReq, mockRes, jest.fn());

      expect(AssetService.delete).toHaveBeenCalledWith('asset1', 'user1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, {}, 'Download count incremented'),
      );
    });
  });
});
