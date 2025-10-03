import dotenv from 'dotenv';
import logger from './config/logger';
import connectDB, { closeDB } from './db';
import { setupMinIO } from './config/minio';
import { createWorker } from './config/queue';
import { app } from './app';
import { handleJob } from './controllers/worker.controller';

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await connectDB();
    logger.info('MongoDB connected successfully');

    await setupMinIO();
    logger.info('MinIO setup completed');

    createWorker('asset-processing', async (jobData) => {
      return await handleJob(jobData);
    });
    app.listen(PORT, () => {
      logger.info(`Asset Worker listening on port ${PORT}`);
    });
    logger.info('Asset Worker started and listening for jobs...');

    const shutdown = async () => {
      logger.info('Shutting down worker gracefully');
      await closeDB();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    logger.error('Worker initialization failed:', err);
    process.exit(1);
  }
}

main();
