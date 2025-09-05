import * as Minio from 'minio';

export const BUCKET_NAME = process.env.MINIO_DEFAULT_BUCKETS || 'dam-assets';

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000', 10),
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER || 'admin',
  secretKey: process.env.MINIO_ROOT_PASSWORD || 'admin12345',
});
export async function initializeMinIO() {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME);

    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME);
      console.log(`MinIO bucket '${BUCKET_NAME}' created successfully`);
    } else {
      console.log(`MinIO bucket '${BUCKET_NAME}' already exists`);
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
    console.log('MinIO initialized successfully');
  } catch (error) {
    console.error('MinIO initialization failed:', error);
    throw error;
  }
}
