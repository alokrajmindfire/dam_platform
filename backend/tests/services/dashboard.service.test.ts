import { DashboardService } from '../../src/services/dashboard.service';
import { Asset } from '../../src/models/assets.model';

jest.mock('../../src/models/assets.model');

describe('DashboardService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getStats', () => {
        it('should return dashboard stats correctly', async () => {
            (Asset.countDocuments as jest.Mock).mockResolvedValue(10);

            (Asset.aggregate as jest.Mock).mockImplementationOnce(() =>
                Promise.resolve([
                    { _id: '2025-09-10', count: 3 },
                    { _id: '2025-09-11', count: 2 },
                ])
            );

            (Asset.aggregate as jest.Mock).mockImplementationOnce(() =>
                Promise.resolve([{ totalDownloads: 15 }])
            );

            (Asset.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue([
                    { filename: 'file1.png', originalName: 'File 1', mimeType: 'image/png', createdAt: new Date(), downloadCount: 5, tags: ['image'], status: 'uploading' },
                    { filename: 'file2.mp4', originalName: 'Video 1', mimeType: 'video/mp4', createdAt: new Date(), downloadCount: 3, tags: ['video'], status: 'processing' },
                ]),
            });

            const result = await DashboardService.getStats();

            expect(Asset.countDocuments).toHaveBeenCalled();
            expect(Asset.aggregate).toHaveBeenCalledTimes(2);
            expect(Asset.find).toHaveBeenCalled();

            expect(result).toEqual({
                totalAssets: 10,
                uploadCounts: [
                    { _id: '2025-09-10', count: 3 },
                    { _id: '2025-09-11', count: 2 },
                ],
                totalDownloads: 15,
                latestAssets: [
                    expect.objectContaining({ filename: 'file1.png' }),
                    expect.objectContaining({ filename: 'file2.mp4' }),
                ],
            });
        });

        it('should handle empty downloadCounts', async () => {
            (Asset.countDocuments as jest.Mock).mockResolvedValue(5);
            (Asset.aggregate as jest.Mock).mockImplementationOnce(() => Promise.resolve([{ _id: '2025-09-10', count: 1 }]));
            (Asset.aggregate as jest.Mock).mockImplementationOnce(() => Promise.resolve([]));
            (Asset.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockResolvedValue([]),
            });

            const result = await DashboardService.getStats();

            expect(result.totalDownloads).toBe(0);
        });
    });
});
