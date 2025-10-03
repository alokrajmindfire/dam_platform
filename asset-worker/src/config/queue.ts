import { Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';
import logger from './logger';

const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

export const redisConnection = new IORedis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisConnection.on('connect', () => {
  logger.info('Worker connected to Redis');
});

redisConnection.on('error', (err) => {
  if (err.message.includes('LOADING')) {
    logger.warn('Redis still loading dataset, retrying...');
  } else {
    logger.error('Worker Redis error:', err);
  }
});

// Factory function to create workers
export function createWorker(
  queueName: string,
  processor: (jobData: any) => Promise<any>,
) {
  const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '5', 10);

  const worker = new Worker(
    queueName,
    async (job) => {
      logger.info(`Processing job ${job.id} of type ${job.name}`);
      return await processor(job.data);
    },
    { connection: redisConnection, concurrency },
  );

  worker.on('completed', (job, result) => {
    logger.info(
      `Job ${job.id} completed with result: ${JSON.stringify(result)}`,
    );
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  worker.on('progress', (job, progress) => {
    logger.debug(`Job ${job.id} progress: ${progress}%`);
  });

  worker.on('error', (err) => {
    logger.error('Worker runtime error:', err);
  });

  // Queue event monitoring
  const queueEvents = new QueueEvents(queueName, {
    connection: redisConnection,
  });

  queueEvents.on('completed', ({ jobId }) => {
    logger.info(`Queue Event: Job ${jobId} completed`);
  });

  queueEvents.on('failed', ({ jobId, failedReason }) => {
    logger.error(`Queue Event: Job ${jobId} failed: ${failedReason}`);
  });

  return worker;
}
