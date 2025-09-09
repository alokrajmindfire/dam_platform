import { Worker } from 'bullmq';
import { AssetProcessor } from './processors/AssetProcessor';
import connectDB, { closeDB } from './db/index';
import IORedis from 'ioredis';
import logger from './utils/logger';
import { setupMinIO } from './config/minio';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});
const redisConnection = new IORedis(
  process.env.REDIS_HOST || 'redis://localhost:6379',
);

redisConnection.on('connect', () => {
  logger.info('Worker connected to Redis');
});

redisConnection.on('error', (err) => {
  logger.error('Worker Redis connection error:', err);
});

setupMinIO()
  .then(() => logger.info('Worker MinIO setup completed'))
  .catch((err) => logger.error('Worker MinIO setup error:', err));

connectDB().catch((err) => {
  logger.error('MONGO DB connection failed !!! ', err);
});

const worker = new Worker(
  'asset-processing',
  async (job) => {
    try {
      logger.info(`Processing job ${job.id}: ${job.name}`);
      console.log('job.name', job.name);
      await job.updateProgress(0);

      let result;
      switch (job.name) {
        case 'process-asset':
          result = await AssetProcessor.processAsset(job.data);
          break;
        default:
          throw new Error(`Unknown job type: ${job.name}`);
      }

      await job.updateProgress(100);
      logger.info(`Job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
);

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});

worker.on('progress', (job, progress) => {
  logger.debug(`Job ${job.id} progress: ${progress}%`);
});

worker.on('error', (err) => {
  logger.error('Worker error:', err);
});

const shutdown = async () => {
  logger.info('Shutting down worker gracefully');
  await worker.close();
  await redisConnection.quit();
  await closeDB();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

logger.info('Asset processing worker started');
