import { AssetService } from '../../src/services/assets.service';
import { AssetRepository } from '../../src/repositories/assets.repositories';
import { minioClient } from '../../src/config/minio';
import { assetProcessingQueue } from '../../src/config/queue';
import { Types, Schema } from 'mongoose';

jest.mock('../../src/repositories/assets.repositories');
jest.mock('../../src/config/minio');
jest.mock('../../src/config/queue');

describe('AssetService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadAsset', () => {
        it('should upload asset successfully', async () => {
            const mockFile = {
                originalname: 'file.png',
                mimetype: 'image/png',
                size: 1000,
                buffer: Buffer.from('test'),
            } as Express.Multer.File;

            const owner = { userId: new Types.ObjectId() as unknown as Schema.Types.ObjectId };

            (minioClient.putObject as jest.Mock).mockResolvedValue(true);
            const fakeAsset = { _id: 'asset1', filename: 'file.png' };
            (AssetRepository.create as jest.Mock).mockResolvedValue(fakeAsset);
            (assetProcessingQueue.add as jest.Mock).mockResolvedValue(true);

            const result = await AssetService.uploadAsset(mockFile, owner);

            expect(minioClient.putObject).toHaveBeenCalled();
            expect(AssetRepository.create).toHaveBeenCalled();
            expect(assetProcessingQueue.add).toHaveBeenCalled();
            expect(result).toEqual(fakeAsset);
        });

        it('should throw error if upload fails', async () => {
            const mockFile = {
                originalname: 'file.png',
                mimetype: 'image/png',
                size: 1000,
                buffer: Buffer.from('test'),
            } as Express.Multer.File;

            const owner = { userId: new Types.ObjectId() as unknown as Schema.Types.ObjectId };

            (minioClient.putObject as jest.Mock).mockRejectedValue(new Error('Fail'));

            await expect(AssetService.uploadAsset(mockFile, owner)).rejects.toThrow(
                'Failed to upload asset'
            );
        });
    });

    describe('incrementDownloadCount', () => {
        it('should call repository to increment download count', async () => {
            (AssetRepository.incrementDownloadCount as jest.Mock).mockResolvedValue(undefined);

            await AssetService.incrementDownloadCount('asset1');

            expect(AssetRepository.incrementDownloadCount).toHaveBeenCalledWith('asset1');
        });
    });

    describe('delete', () => {
        it('should call repository to delete asset', async () => {
            (AssetRepository.delete as jest.Mock).mockResolvedValue(true);

            const result = await AssetService.delete('asset1', 'user1');

            expect(AssetRepository.delete).toHaveBeenCalledWith('asset1', 'user1');
            expect(result).toBe(true);
        });
    });

    describe('generateTags', () => {
        it('should generate tags from filename and mimetype', () => {
            const tags = (AssetService as any).generateTags('my File.png', 'image/png');
            expect(tags).toEqual(expect.arrayContaining(['image', 'png', 'file']));
        });
    });

});
