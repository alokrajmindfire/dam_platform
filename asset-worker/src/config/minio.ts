import * as Minio from 'minio';
import logger from './logger';

export const BUCKET_NAME = process.env.MINIO_DEFAULT_BUCKETS || 'dam-assets';

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || 'admin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'admin12345',
});

export async function setupMinIO() {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
      logger.info(`Worker: Bucket ${BUCKET_NAME} created successfully`);
    }

    logger.info(`Worker: MinIO bucket ${BUCKET_NAME} is ready`);
  } catch (error) {
    logger.error('Worker: Error setting up MinIO:', error);
    throw error;
  }
}
