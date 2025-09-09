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
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const uploadPromises = files.map((file) =>
      AssetService.uploadAsset(file, user._id as Schema.Types.ObjectId),
    );
    const assets = await Promise.all(uploadPromises);
    console.log('assets', assets);
    return res
      .status(201)
      .json(new ApiResponse(201, assets, 'Assets uploaded successfully'));
  },
);
const getAssetsId = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const { id } = req.params;
    if (!id) {
      throw new ApiError(404, 'id does not exist');
    }
    const assets = await AssetService.getAssetUrl(id as string);
    return res
      .status(200)
      .json(new ApiResponse(200, assets, 'Assets found successfully'));
  },
);
const getAssets = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const assets = await AssetService.getAssetsUrl(
      user._id as Schema.Types.ObjectId,
    );
    return res
      .status(200)
      .json(new ApiResponse(200, assets, 'Assets found successfully'));
  },
);

export { uploadAssets, getAssetsId, getAssets };
