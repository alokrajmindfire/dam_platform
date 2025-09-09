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

  static async findMany(user_id: Schema.Types.ObjectId): Promise<IAsset[]> {
    const assets = await Asset.find({ userId: user_id }).lean();
    console.log('assets', assets);
    return assets;
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
