import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Schema } from 'mongoose';
import { AssetRepository } from '../repositories/assets.repositories';
import { BUCKET_NAME, minioClient } from '../config/minio';
import { IAsset } from '../models/assets.model';
import { assetProcessingQueue } from '../config/queue';
import { FindManyFilters } from '../types/assets.types';
import { ApiError } from '../utils/ApiError';
import logger from '../utils/logger';

type Owner = {
  userId?: Schema.Types.ObjectId;
  teamId?: Schema.Types.ObjectId;
  projectId?: Schema.Types.ObjectId;
  channels?: string[];
};

export class AssetService {
  static async uploadAsset(file: Express.Multer.File, owner: Owner) {
    try {
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const filename = `${fileId}${fileExtension}`;
      const storagePath = `assets/${filename}`;

      await minioClient.putObject(
        BUCKET_NAME,
        storagePath,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Content-Disposition': `inline; filename="${file.originalname}"`,
        },
      );

      const assetData: Partial<IAsset> = {
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storagePath,
        userId: owner.userId,
        tags: this.generateTags(file.originalname, file.mimetype),
        status: 'uploading',
        channels: (owner.channels || []).map((c) => c.toLowerCase()),
        teamId: owner.teamId,
        projectId: owner.projectId,
      };

      const asset = await AssetRepository.create(assetData);

      await assetProcessingQueue.add(
        'process-asset',
        {
          assetId: asset._id.toString(),
          storagePath,
          mimeType: file.mimetype,
          filename,
          teamId: owner.teamId?.toString(),
          projectId: owner.projectId?.toString(),
        },
        {
          priority: file.mimetype.startsWith('image/') ? 1 : 2,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        },
      );

      return asset;
    } catch (error) {
      logger.error('Asset upload failed:', error);
      throw new Error('Failed to upload asset');
    }
  }

  static async getAssetsUrl(
    userId: Schema.Types.ObjectId,
    filters?: FindManyFilters & {
      teamId?: string;
      projectId?: string;
      channels?: string[];
      date?: string;
    },
  ) {
    return AssetRepository.findManyForUser(userId, filters);
  }

  static async incrementDownloadCount(assetId: string): Promise<void> {
    return AssetRepository.incrementDownloadCount(assetId);
  }

  static async delete(assetId: string, userId: string): Promise<boolean> {
    return AssetRepository.delete(assetId, userId);
  }

  static async getAssetStream(assetId: string) {
    const asset = await AssetRepository.findById(assetId);
    if (!asset) throw new ApiError(404, 'Asset not found');

    const stream = await minioClient.getObject(BUCKET_NAME, asset.storagePath);
    return { stream, asset };
  }

  static async getThumbnailStream(assetId: string) {
    const asset = await AssetRepository.findById(assetId);
    if (!asset) throw new ApiError(404, 'Asset not found');
    if (!(asset as any).thumbnailUrl)
      throw new ApiError(404, 'Thumbnail not found');
    console.log('Thumbnail path:', (asset as any).thumbnailUrl);

    const stream = await minioClient.getObject(
      BUCKET_NAME,
      (asset as any).thumbnailUrl,
    );
    return { stream, asset };
  }

  private static generateTags(filename: string, mimeType: string): string[] {
    const tags: string[] = [];

    if (mimeType.startsWith('image/')) tags.push('image');
    else if (mimeType.startsWith('video/')) tags.push('video');
    else if (mimeType.startsWith('audio/')) tags.push('audio');
    else tags.push('document');

    const format = mimeType.split('/')[1];
    if (format) tags.push(format);

    const nameWords = filename
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);

    tags.push(...nameWords.slice(0, 5));
    return Array.from(new Set(tags));
  }
}
