import { Queue } from 'bullmq';
import { createClient } from 'redis';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
};

export const assetProcessingQueue = new Queue('asset-processing', {
  connection: redisConnection,
});

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export async function initializeQueue() {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully');
    console.log('Asset processing queue initialized');
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}
