import { Asset } from '../models/assets.model';

export class DashboardService {
  static async getStats() {
    const totalAssets = await Asset.countDocuments();

    const uploadCounts = await Asset.aggregate([
      { $match: { createdAt: { $exists: true } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const downloadCounts = await Asset.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: '$downloadCount' },
        },
      },
    ]);

    const latestAssets = await Asset.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select(
        'filename originalName mimeType createdAt downloadCount tags status',
      );

    return {
      totalAssets,
      uploadCounts,
      totalDownloads:
        downloadCounts.length > 0 ? downloadCounts[0].totalDownloads : 0,
      latestAssets,
    };
  }
}
