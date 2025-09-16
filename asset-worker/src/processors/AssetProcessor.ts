import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { minioClient, BUCKET_NAME } from '../config/minio';
import { Asset } from '../models/assets.model';
import pdfParse from 'pdf-parse';
import logger from '../utils/logger';

interface ProcessAssetData {
  assetId: string;
  storagePath: string;
  mimeType: string;
  filename: string;
}

export class AssetProcessor {
  static async processAsset(data: ProcessAssetData) {
    const { assetId, storagePath, mimeType, filename } = data;
    // console.log({ assetId, storagePath, mimeType, filename });
    try {
      if (mimeType.startsWith('image/')) {
        await this.processImage(assetId, storagePath, filename);
      } else if (mimeType.startsWith('video/')) {
        await this.processVideo(assetId, storagePath, filename);
      } else {
        await this.processDocument(assetId, storagePath, filename);
      }
    } catch (error) {
      logger.error(`Failed to process asset ${assetId}:`, error);
      throw error;
    }
  }

  private static async processImage(
    assetId: string,
    storagePath: string,
    filename: string,
  ) {
    try {
      const chunks: Buffer[] = [];
      const imageStream = await minioClient.getObject(BUCKET_NAME, storagePath);

      for await (const chunk of imageStream) chunks.push(chunk);
      const imageBuffer = Buffer.concat(chunks);

      const thumbnailBuffer = await sharp(imageBuffer)
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailPath = `thumbnails/thumb_${filename}`;
      await minioClient.putObject(
        BUCKET_NAME,
        thumbnailPath,
        thumbnailBuffer,
        thumbnailBuffer.length,
        {
          'Content-Type': 'image/jpeg',
        },
      );

      const metadata = await sharp(imageBuffer).metadata();
      await Asset.findByIdAndUpdate(assetId, {
        thumbnailUrl: thumbnailPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          duration: undefined,
        },
        status: 'ready',
      });
    } catch (error) {
      logger.error('Image processing failed:', error);
      await Asset.findByIdAndUpdate(assetId, { status: 'failed' });
      throw error;
    }
  }

  private static async processVideo(
    assetId: string,
    storagePath: string,
    filename: string,
  ) {
    try {
      const videoUrl = await minioClient.presignedGetObject(
        BUCKET_NAME,
        storagePath,
        3600,
      );

      const tempThumbnailPath = path.join(
        '/tmp',
        `thumb_${new Date().getTime().toString()}.jpg`,
      );
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoUrl)
          .screenshots({
            timestamps: ['00:00:01.000'],
            filename: path.basename(tempThumbnailPath),
            folder: '/tmp',
            size: '300x300',
          })
          .on('end', () => resolve())
          .on('error', reject);
      });

      const thumbnailBuffer = await fs.readFile(tempThumbnailPath);
      const thumbnailPath = `thumbnails/thumb_${filename}.jpg`;
      await minioClient.putObject(
        BUCKET_NAME,
        thumbnailPath,
        thumbnailBuffer,
        thumbnailBuffer.length,
        {
          'Content-Type': 'image/jpeg',
        },
      );
      await fs.unlink(tempThumbnailPath);

      const metadata: any = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoUrl, (err, data) =>
          err ? reject(err) : resolve(data),
        );
      });
      const videoStream = metadata.streams.find(
        (s: any) => s.codec_type === 'video',
      );
      const originalHeight = videoStream.height;

      const tempDir = '/tmp';
      const resolutions: { name: string; width: number; height: number }[] = [];
      if (originalHeight >= 1080)
        resolutions.push({ name: '1080p', width: 1920, height: 1080 });
      if (originalHeight >= 720)
        resolutions.push({ name: '720p', width: 1280, height: 720 });
      if (resolutions.length === 0)
        resolutions.push({
          name: 'original',
          width: videoStream.width,
          height: originalHeight,
        });

      const transcodedPaths: Record<string, string> = {};

      for (const res of resolutions) {
        const tempOutput = path.join(
          tempDir,
          `${new Date().getTime().toString()}_${res.name}.mp4`,
        );
        const storagePathRes = `videos/${new Date().getTime().toString()}_${res.name}.mp4`;

        await new Promise<void>((resolve, reject) => {
          ffmpeg(videoUrl)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size(`${res.width}x${res.height}`)
            .fps(30)
            .videoBitrate('1000k')
            .audioBitrate('128k')
            .output(tempOutput)
            .on('end', () => resolve())
            .on('error', reject)
            .run();
        });

        const buffer = await fs.readFile(tempOutput);
        await minioClient.putObject(
          BUCKET_NAME,
          storagePathRes,
          buffer,
          buffer.length,
          {
            'Content-Type': 'video/mp4',
          },
        );
        await fs.unlink(tempOutput);

        transcodedPaths[res.name] = storagePathRes;
      }

      await Asset.findByIdAndUpdate(assetId, {
        thumbnailUrl: thumbnailPath,
        metadata: {
          width: videoStream.width,
          height: originalHeight,
          duration: Math.round(parseFloat(metadata.format.duration)),
        },
        transcoded: transcodedPaths,
        status: 'ready',
      });
    } catch (error) {
      logger.error('Video processing failed:', error);
      await Asset.findByIdAndUpdate(assetId, { status: 'failed' });
      throw error;
    }
  }

  private static async processDocument(
    assetId: string,
    storagePath: string,
    filename: string,
  ) {
    try {
      if (!filename.endsWith('.pdf')) return;

      const chunks: Buffer[] = [];
      const pdfStream = await minioClient.getObject(BUCKET_NAME, storagePath);
      for await (const chunk of pdfStream) chunks.push(chunk);
      const pdfBuffer = Buffer.concat(chunks);

      const data = await pdfParse(pdfBuffer);

      await Asset.findByIdAndUpdate(assetId, {
        metadata: {
          pageCount: data.numpages,
          textLength: data.text.length,
          textPreview: data.text.substring(0, 1000),
        },
        status: 'ready',
      });
    } catch (error) {
      logger.error('Document processing failed:', error);
      await Asset.findByIdAndUpdate(assetId, { status: 'failed' });
      throw error;
    }
  }
}
