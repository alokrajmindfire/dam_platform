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
    userId: Schema.Types.ObjectId,
    filters: FindManyFilters & {
      teamId?: string;
      projectId?: string;
      channels?: string[];
      role?: string;
      date?: string;
    } = {},
  ) {
    const isAdmin = filters.role === 'admin';
    const q: any = {};

    if (!isAdmin) {
      const allowedTeamIds = await Team.find({
        'members.userId': userId,
      }).distinct('_id');

      if (filters.teamId) {
        if (!allowedTeamIds.map(String).includes(filters.teamId)) {
          throw new ApiError(403, 'Not a member of the requested team');
        }
        q.teamId = filters.teamId;
        if (filters.projectId) q.projectId = filters.projectId;
      } else {
        q.$or = [{ userId }, { teamId: { $in: allowedTeamIds } }];

        if (filters.projectId) {
          q.$or = [
            { userId },
            { teamId: { $in: allowedTeamIds }, projectId: filters.projectId },
          ];
        }
      }
    } else {
      if (filters.teamId) q.teamId = filters.teamId;
      if (filters.projectId) q.projectId = filters.projectId;
    }

    if (filters.channels?.length) {
      q.channels = { $in: filters.channels.map((c) => c.toLowerCase()) };
    }

    if (filters.filter) {
      q.$and = q.$and || [];
      q.$and.push({
        $or: [
          { mimeType: { $regex: filters.filter, $options: 'i' } },
          { status: { $regex: filters.filter, $options: 'i' } },
          { tags: { $regex: filters.filter, $options: 'i' } },
          { channels: { $regex: filters.filter, $options: 'i' } },
        ],
      });
    }

    if (filters.search) {
      q.$and = q.$and || [];
      q.$and.push({
        $or: [
          { originalName: { $regex: filters.search, $options: 'i' } },
          { filename: { $regex: filters.search, $options: 'i' } },
          { mimeType: { $regex: filters.search, $options: 'i' } },
          { tags: { $regex: filters.search, $options: 'i' } },
          { channels: { $regex: filters.search, $options: 'i' } },
        ],
      });
    }
    if (filters?.date) {
      const start = new Date(filters.date);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + 1);

        q.$and = q.$and || [];
        q.$and.push({
          createdAt: { $gte: start, $lt: end },
        });
      }
    }
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 20;

    const total = await Asset.countDocuments(q);
    const data = await Asset.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'projectId',
        select: 'name description teamId',
        populate: {
          path: 'teamId',
          select: 'name description',
        },
      })
      .populate('teamId', 'name description')
      .lean();

    return { data, total };
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    await Asset.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } }).exec();
  }

  static async delete(id: string, userId: string): Promise<boolean> {
    const asset = await Asset.findById(id).exec();

    if (!asset) return false;

    if (String(asset.userId) !== String(userId)) {
      throw new ApiError(403, 'You are not allowed to delete this asset');
    }

    const result = await Asset.findByIdAndDelete(id).exec();
    return !!result;
  }

  static async aggregate(pipeline: any[]) {
    return Asset.aggregate(pipeline);
  }
}
