import { Schema } from 'mongoose';
import { Asset, IAsset } from '../models/assets.model';
import { FindManyFilters } from 'src/types/assets.types';
import { Team } from '../models/team.model';
import { ApiError } from '../utils/ApiError';

export class AssetRepository {
  static async create(assetData: Partial<IAsset>): Promise<IAsset> {
    const asset = new Asset(assetData);
    return await asset.save();
  }

  static async findById(id: string): Promise<IAsset | null> {
    return await Asset.findById(id).lean().exec();
  }

  static async findManyForUser(
    user_id: Schema.Types.ObjectId,
    filters: FindManyFilters & {
      teamId?: string;
      projectId?: string;
      channels?: string[];
    } = {},
  ): Promise<{ data: IAsset[]; total: number }> {
    const allowedTeamIds = await Team.find({
      'members.userId': user_id,
    }).distinct('_id');

    const q: any = {};

    if (filters.teamId) {
      const teamAllowed = allowedTeamIds.map(String).includes(filters.teamId);
      if (!teamAllowed) {
        throw new ApiError(403, 'Not a member of the requested team');
      }
      q.teamId = filters.teamId;
      if (filters.projectId) q.projectId = filters.projectId;
    } else {
      q.$or = [{ userId: user_id }, { teamId: { $in: allowedTeamIds } }];
      if (filters.projectId) {
        q.$or = [
          { userId: user_id },
          { teamId: { $in: allowedTeamIds }, projectId: filters.projectId },
        ];
      }
    }

    if (
      filters.channels &&
      Array.isArray(filters.channels) &&
      filters.channels.length > 0
    ) {
      q.channels = { $in: filters.channels.map((c) => c.toLowerCase()) };
    }

    if (
      filters.filter &&
      typeof filters.filter === 'string' &&
      filters.filter.trim().length > 0
    ) {
      const f = filters.filter.trim();
      q.$and = q.$and || [];
      q.$and.push({
        $or: [
          { mimeType: { $regex: f, $options: 'i' } },
          { status: { $regex: f, $options: 'i' } },
          { tags: { $regex: f, $options: 'i' } },
          { channels: { $regex: f, $options: 'i' } },
        ],
      });
    }

    if (
      filters.search &&
      typeof filters.search === 'string' &&
      filters.search.trim().length > 0
    ) {
      const term = filters.search.trim();
      q.$and = q.$and || [];
      q.$and.push({
        $or: [
          { originalName: { $regex: term, $options: 'i' } },
          { filename: { $regex: term, $options: 'i' } },
          { mimeType: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } },
          { channels: { $regex: term, $options: 'i' } },
        ],
      });
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
      thumbnailUrl: thumbnailPath,
      updatedAt: new Date(),
    }).exec();
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    await Asset.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).exec();
  }

  static async delete(id: string): Promise<boolean> {
    const result = await Asset.findByIdAndDelete(id).exec();
    return !!result;
  }

  static async updateTags(id: string, tags: string[]): Promise<void> {
    await Asset.findByIdAndUpdate(id, {
      tags,
      updatedAt: new Date(),
    }).exec();
  }

  static async aggregate(pipeline: any[]) {
    return Asset.aggregate(pipeline);
  }
}
