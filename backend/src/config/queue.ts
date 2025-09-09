import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import logger from '../utils/logger';

const redisConnection = new IORedis(
  process.env.REDIS_HOST || 'redis://localhost:6379',
);

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

    console.log('Redis connected successfully');
    console.log('Asset processing queue initialized');
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}
