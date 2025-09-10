import { Schema } from 'mongoose';
import { Asset, IAsset } from '../models/assets.model';
import { FindManyFilters } from 'src/types/assets.types';

export class AssetRepository {
  static async create(assetData: Partial<IAsset>): Promise<IAsset> {
    const asset = new Asset(assetData);
    return await asset.save();
  }

  static async findById(id: string): Promise<IAsset | null> {
    return await Asset.findById(id).exec();
  }

  static async findMany(
    user_id: Schema.Types.ObjectId,
    filters: FindManyFilters = {},
  ): Promise<{ data: IAsset[]; total: number }> {
    const q: any = { userId: user_id };

    if (filters.filter && filters.filter.trim().length > 0) {
      const f = filters.filter.trim();
      q.$or = [
        { mimeType: { $regex: f, $options: 'i' } },
        { status: { $regex: f, $options: 'i' } },
        { tags: { $regex: f, $options: 'i' } },
      ];
    }

    if (filters.search && filters.search.trim().length > 0) {
      const term = filters.search.trim();
      q.$or = [
        { originalName: { $regex: term, $options: 'i' } },
        { filename: { $regex: term, $options: 'i' } },
        { mimeType: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } },
      ];
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;

    const total = await Asset.countDocuments(q);
    const data = await Asset.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return { data, total };
  }

  static async updateThumbnailPath(
    id: string,
    thumbnailPath: string,
  ): Promise<void> {
    await Asset.findByIdAndUpdate(id, {
      thumbnail_path: thumbnailPath,
      updated_at: new Date(),
    });
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    await Asset.findByIdAndUpdate(id, { $inc: { download_count: 1 } });
  }

  static async delete(id: string): Promise<boolean> {
    const result = await Asset.findByIdAndDelete(id);
    return !!result;
  }

  static async updateTags(id: string, tags: string[]): Promise<void> {
    await Asset.findByIdAndUpdate(id, {
      tags,
      updated_at: new Date(),
    });
  }
}
