// import sharp from 'sharp';
// import ffmpeg from 'fluent-ffmpeg';
// import { minioClient, BUCKET_NAME } from '../config/minio';
// import path from 'path';

interface ProcessAssetData {
  assetId: string;
  storagePath: string;
  mimeType: string;
  filename: string;
}

export class AssetProcessor {
  static async processAsset(data: ProcessAssetData) {
    const { assetId, storagePath, mimeType, filename } = data;
    console.log({ assetId, storagePath, mimeType, filename });
  }
}
