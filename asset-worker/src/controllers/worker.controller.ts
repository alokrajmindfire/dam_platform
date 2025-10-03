import { metrics } from '../metrics/metrics';
import { redisConnection } from '../config/queue';
import { Request, Response } from 'express';
import { register } from '../metrics/metrics';
import { asyncHandler } from '../utils/asyncHandler';
import logger from '../config/logger';
import { AssetProcessor } from '../services/asset.services';

async function saveResult(jobId: string, result: any) {
  const redisKey = `job:${encodeURIComponent(jobId)}:result`;
  await redisConnection.set(redisKey, JSON.stringify(result), 'EX', 3600);
}

export const handleJob = async (jobData: any) => {
  const start = Date.now();

  try {
    const result = await AssetProcessor.processAsset(jobData);

    await saveResult(jobData.id, result);

    metrics.jobsProcessed.inc();
    metrics.jobProcessingTime.observe((Date.now() - start) / 1000);

    return { status: 'success', result };
  } catch (error: any) {
    metrics.jobErrors.inc();
    logger.error('Job processing error:', error);

    return {
      status: 'error',
      message: error?.message || 'Job processing failed',
    };
  }
};
export const getMetrics = asyncHandler(async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
