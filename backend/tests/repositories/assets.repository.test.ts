import { AssetRepository } from '../../src/repositories/assets.repositories';
import { Asset } from '../../src/models/assets.model';
import { Team } from '../../src/models/team.model';
import { ApiError } from '../../src/utils/ApiError';
import { Types, Schema } from 'mongoose';

jest.mock('../../src/models/assets.model');
jest.mock('../../src/models/team.model');

describe('AssetRepository', () => {
    const mockUserId = new Types.ObjectId();
    const mockAssetId = new Types.ObjectId();
    const mockTeamId = new Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return an asset', async () => {
            const assetData = { filename: 'file.png', userId: mockUserId as unknown as Schema.Types.ObjectId };
            const mockAsset = { ...assetData, save: jest.fn().mockResolvedValue(assetData) };
            (Asset as any).mockImplementation(() => mockAsset);

            const result = await AssetRepository.create(assetData);
            expect(mockAsset.save).toHaveBeenCalled();
            expect(result).toEqual(assetData);
        });
    });

    describe('findById', () => {
        it('should return asset by id', async () => {
            const mockAsset = { _id: mockAssetId };
            (Asset.findById as jest.Mock).mockReturnValue({ lean: jest.fn().mockReturnThis(), exec: jest.fn().mockResolvedValue(mockAsset) });

            const result = await AssetRepository.findById(mockAssetId.toHexString());
            expect(Asset.findById).toHaveBeenCalledWith(mockAssetId.toHexString());
            expect(result).toEqual(mockAsset);
        });
    });

    describe('findManyForUser', () => {
        it('should return filtered assets for user', async () => {
            const mockAssets = [{ _id: mockAssetId }];
            (Team.find as jest.Mock).mockReturnValue({ distinct: jest.fn().mockResolvedValue([mockTeamId]) });
            (Asset.countDocuments as jest.Mock).mockResolvedValue(1);
            (Asset.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockAssets)
            });

            const result = await AssetRepository.findManyForUser(mockUserId as unknown as Schema.Types.ObjectId, { teamId: mockTeamId.toHexString() });
            expect(Asset.countDocuments).toHaveBeenCalled();
            expect(Asset.find).toHaveBeenCalled();
            expect(result.data).toEqual(mockAssets);
            expect(result.total).toEqual(1);
        });

        it('should throw error if user is not a member of requested team', async () => {
            (Team.find as jest.Mock).mockReturnValue({ distinct: jest.fn().mockResolvedValue([]) });

            await expect(
                AssetRepository.findManyForUser(mockUserId as unknown as Schema.Types.ObjectId, { teamId: mockTeamId.toHexString() })
            ).rejects.toThrow(ApiError);
        });
    });

    describe('incrementDownloadCount', () => {
        it('should increment download count', async () => {
            const mockUpdate = { exec: jest.fn().mockResolvedValue(true) };
            (Asset.findByIdAndUpdate as jest.Mock).mockReturnValue(mockUpdate);

            await AssetRepository.incrementDownloadCount(mockAssetId.toHexString());
            expect(Asset.findByIdAndUpdate).toHaveBeenCalledWith(mockAssetId.toHexString(), { $inc: { downloadCount: 1 } });
            expect(mockUpdate.exec).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete asset if user is owner', async () => {
            const mockAsset = { _id: mockAssetId, userId: mockUserId };
            (Asset.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockAsset) });
            (Asset.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(true) });

            const result = await AssetRepository.delete(mockAssetId.toHexString(), mockUserId.toHexString());
            expect(result).toBe(true);
        });

        it('should throw error if user is not owner', async () => {
            const mockAsset = { _id: mockAssetId, userId: new Types.ObjectId() };
            (Asset.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(mockAsset) });

            await expect(
                AssetRepository.delete(mockAssetId.toHexString(), mockUserId.toHexString())
            ).rejects.toThrow(ApiError);
        });

        it('should return false if asset does not exist', async () => {
            (Asset.findById as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });

            const result = await AssetRepository.delete(mockAssetId.toHexString(), mockUserId.toHexString());
            expect(result).toBe(false);
        });
    });

    describe('aggregate', () => {
        it('should call aggregate and return result', async () => {
            const pipeline = [{ $match: {} }];
            const mockResult = [{ _id: 1 }];
            (Asset.aggregate as jest.Mock).mockResolvedValue(mockResult);

            const result = await AssetRepository.aggregate(pipeline);
            expect(Asset.aggregate).toHaveBeenCalledWith(pipeline);
            expect(result).toEqual(mockResult);
        });
    });
});
