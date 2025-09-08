import { Worker } from 'bullmq';
import { AssetProcessor } from './processors/AssetProcessor';

const redisConnection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'admin12345',
  retryStrategy: (retries: number) => {
    if (retries > 1) return null;
    return Math.min(retries * 1000, 10000);
  },
};

const worker: Worker | null = new Worker(
  'asset-processing',
  async (job) => {
    console.log(`Processing job: ${job.id}, type: ${job.name}`);

    switch (job.name) {
      case 'process-asset':
        return await AssetProcessor.processAsset(job.data);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.WORKER_CONCURRENCY || '2', 10),
  },
);

worker.on('completed', (job) => {
  console.log(`${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`${job?.id} failed:`, err);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});

console.log('Asset processing worker started');

const shutdown = async () => {
  try {
    console.log('Shutting down worker...');
    if (worker) {
      await worker.close();
      console.log('Worker stopped.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
