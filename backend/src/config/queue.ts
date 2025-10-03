import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || 'admin12345';

export const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export const assetProcessingQueue = new Queue('asset-processing', {
  connection: redisConnection,
});

export async function initializeQueue() {
  try {
    redisConnection.on('connect', () => {
      logger.info('Worker connected to Redis');
    });

    redisConnection.on('error', (err) => {
      logger.error('Worker Redis connection error:', err);
    });

    logger.info('Redis connected successfully');
    logger.info('Asset processing queue initialized');
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
}
