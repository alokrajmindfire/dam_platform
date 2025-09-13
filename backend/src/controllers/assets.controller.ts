import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AssetService } from '../services/assets.service';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { Schema } from 'mongoose';

const uploadAssets = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const user = req.user;
    if (!user) throw new ApiError(404, 'User does not exist');

    const { teamId, projectId, channels } = req.body;

    const uploadPromises = files.map((file) =>
      AssetService.uploadAsset(file, {
        userId: user._id as Schema.Types.ObjectId,
        teamId: teamId || undefined,
        projectId: projectId || undefined,
        channels: channels
          ? Array.isArray(channels)
            ? channels
            : channels.split(',').map((c: string) => c.trim().toLowerCase())
          : [],
      }),
    );

    const assets = await Promise.all(uploadPromises);

    return res
      .status(201)
      .json(new ApiResponse(201, assets, 'Assets uploaded successfully'));
  },
);

const getAssetsId = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    if (!user) throw new ApiError(404, 'User does not exist');

    const { id } = req.params;
    if (!id) throw new ApiError(400, 'Asset ID required');

    const assetUrl = await AssetService.getAssetUrl(id as string);
    return res
      .status(200)
      .json(new ApiResponse(200, assetUrl, 'Asset retrieved'));
  },
);

const getAssets = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    if (!user) throw new ApiError(401, 'Unauthorized');

    const {
      search = '',
      filter = '',
      page = 1,
      limit = 6,
      teamId,
      projectId,
      channels,
      date,
    } = req.query;

    const filters = {
      search: String(search),
      filter: String(filter),
      page: Number(page),
      limit: Number(limit),
      teamId: teamId ? String(teamId) : undefined,
      projectId: projectId ? String(projectId) : undefined,
      channels: channels
        ? Array.isArray(channels)
          ? channels.map(String)
          : String(channels)
              .split(',')
              .map((c) => c.trim().toLowerCase())
        : [],
      role: user.role,
      date: String(date),
    };

    const { data, total } = await AssetService.getAssetsUrl(
      user._id as Schema.Types.ObjectId,
      filters,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { assets: data, total }, 'Assets retrieved'));
  },
);

const updateAssetsDownloadCount = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { id } = req.params;
    await AssetService.incrementDownloadCount(id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Download count incremented'));
  },
);

const deleteAsset = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { id } = req.params;
    const userId = req.user?._id as string;

    if (!userId) {
      throw new ApiError(401, 'Unauthorized');
    }
    const deleted = await AssetService.delete(id, userId);
    if (!deleted) {
      throw new ApiError(404, 'Asset not found');
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Download count incremented'));
  },
);

export {
  uploadAssets,
  getAssetsId,
  getAssets,
  updateAssetsDownloadCount,
  deleteAsset,
};
