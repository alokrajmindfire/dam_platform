import { Schema } from 'mongoose';
import { Asset, IAsset } from '../models/assets.model';

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
    filters?: {
      search?: string;
      type?: string;
      status?: string;
      tags?: string[];
    },
  ): Promise<IAsset[]> {
    const q: any = { userId: user_id };

    if (filters?.status) {
      q.status = filters.status;
    }

    if (filters?.type) {
      // match by mimeType containing type (e.g., 'video', 'image')
      q.mimeType = { $regex: filters.type, $options: 'i' };
    }

    if (filters?.tags && filters.tags.length > 0) {
      q.tags = { $in: filters.tags.map((t) => t.toLowerCase()) };
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const term = filters.search.trim();
      q.$or = [
        { originalName: { $regex: term, $options: 'i' } },
        { filename: { $regex: term, $options: 'i' } },
        { mimeType: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } },
      ];
    }

    return Asset.find(q).lean();
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
