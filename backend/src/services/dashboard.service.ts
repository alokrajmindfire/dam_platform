import { AssetRepository } from '../repositories/assets.repositories';
import { Asset } from '../models/assets.model';

export class DashboardService {
  static async getStats() {
    const totalAssets = await Asset.countDocuments();

    const uploadCounts = await Asset.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const downloadCounts = await AssetRepository.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloadCount' },
        },
      },
    ]);

    const latestAssets = await Asset.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('filename originalName mimeType createdAt');

    const breakdownByType = await Asset.aggregate([
      {
        $group: {
          _id: {
            $substr: ['$mimeType', 0, { $indexOfBytes: ['$mimeType', '/'] }],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalAssets,
      uploadCounts,
      totalDownloads: downloadCounts[0]?.totalDownloads || 0,
      latestAssets,
      breakdownByType,
    };
  }
}
