import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { CreateAssetData } from '../types/assets.types';
import { AssetRepository } from '../repositories/assets.repositories';
import { BUCKET_NAME, minioClient } from '../config/minio';
import { Schema } from 'mongoose';
import { IAsset } from 'src/models/assets.model';

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

      const assetData: CreateAssetData = {
        filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        file_size: file.size,
        storage_path: storagePath,
        user_id: userId,
        tags: this.generateTags(file.originalname, file.mimetype),
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalSize: file.size,
        },
      };

      const asset = await AssetRepository.create(assetData);

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
      asset.storage_path,
      7 * 24 * 60 * 60,
    );
  }
  static async getAssetsUrl(
    user_id: Schema.Types.ObjectId,
  ): Promise<(IAsset & { url: string })[]> {
    const assets = await AssetRepository.findMany(user_id);

    if (!assets || assets.length === 0) {
      throw new Error('No assets found');
    }

    const assetsWithUrls = await Promise.all(
      assets.map(async (asset) => {
        const url = await minioClient.presignedGetObject(
          BUCKET_NAME,
          asset.storage_path,
          7 * 24 * 60 * 60,
        );

        return {
          ...asset.toObject(),
          url,
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
