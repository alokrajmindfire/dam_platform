import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { AssetRepository } from '../repositories/assets.repositories';
import { BUCKET_NAME, minioClient } from '../config/minio';
import { Schema, Types } from 'mongoose';
import { IAsset } from '../models/assets.model';
import { assetProcessingQueue } from '../config/queue';

export class AssetService {
  static async uploadAsset(
    file: Express.Multer.File,
    userId: Schema.Types.ObjectId,
  ) {
    try {
      const fileId = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const filename = `${fileId}${fileExtension}`;
      const storagePath = `assets/${filename}`;
      console.log('file', file);
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
        storagePath: storagePath,
        userId: userId,
        tags: this.generateTags(file.originalname, file.mimetype),
        status: 'uploading',
      };

      const asset = await AssetRepository.create(assetData);
      await assetProcessingQueue.add(
        'process-asset',
        {
          assetId: asset.id,
          storagePath,
          mimeType: file.mimetype,
          filename,
        },
        {
          priority: file.mimetype.startsWith('image/') ? 1 : 2,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      );
      return asset;
    } catch (error) {
      console.error('Asset upload failed:', error);
      throw new Error('Failed to upload asset');
    }
  }

  static async getAssetUrl(assetId: string): Promise<string> {
    const asset = await AssetRepository.findById(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }

    return await minioClient.presignedGetObject(
      BUCKET_NAME,
      asset.storagePath,
      7 * 24 * 60 * 60,
    );
  }
  static async getAssetsUrl(user_id: Schema.Types.ObjectId, filters?: any) {
    const assets = await AssetRepository.findMany(user_id, filters);

    if (!assets || assets.length === 0) {
      return [];
    }

    const assetsWithUrls = await Promise.all(
      assets.map(async (asset: any) => {
        const url = await minioClient.presignedGetObject(
          BUCKET_NAME,
          asset.storagePath,
          7 * 24 * 60 * 60,
        );

        let thumbnailUrlSigned: string | undefined = undefined;
        if (asset.thumbnailUrl) {
          thumbnailUrlSigned = await minioClient.presignedGetObject(
            BUCKET_NAME,
            asset.thumbnailUrl,
            7 * 24 * 60 * 60,
          );
        }

        const transcodedUrls: Record<string, string> = {};
        if (asset.transcoded && typeof asset.transcoded === 'object') {
          for (const [quality, path] of Object.entries(asset.transcoded)) {
            if (path) {
              transcodedUrls[quality] = await minioClient.presignedGetObject(
                BUCKET_NAME,
                path as string,
                7 * 24 * 60 * 60,
              );
            }
          }
        }

        return {
          ...asset,
          url,
          thumbnailUrlSigned,
          transcodedUrls,
        };
      }),
    );

    return assetsWithUrls;
  }

  private static generateTags(filename: string, mimeType: string): string[] {
    const tags = [];

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

    return [...new Set(tags)];
  }
}
