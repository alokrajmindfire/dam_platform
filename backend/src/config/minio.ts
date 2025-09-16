import * as Minio from 'minio';
import logger from 'src/utils/logger';

const { MINIO_ENDPOINT, MINIO_PORT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD } =
  process.env;

export const BUCKET_NAME = process.env.MINIO_DEFAULT_BUCKETS || 'dam-assets';

export const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT || 'localhost',
  port: parseInt(MINIO_PORT || '9000', 10),
  useSSL: false,
  accessKey: MINIO_ROOT_USER || 'admin',
  secretKey: MINIO_ROOT_PASSWORD || 'admin12345',
});

export async function initializeMinIO() {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      logger.info(`MinIO bucket '${BUCKET_NAME}' created successfully`);
    } else {
      logger.info(`MinIO bucket '${BUCKET_NAME}' already exists`);
    }

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
        },
      ],
    };

    await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    logger.info('MinIO initialized successfully');
  } catch (error) {
    logger.error('MinIO initialization failed:', error);
    throw error;
  }
}
