import connectDB from './db/index';
import dotenv from 'dotenv';
import { app } from './app';
import { initializeMinIO } from './config/minio';
import logger from './utils/logger';

dotenv.config({
  path: './.env',
});

app.use('/', () => {
  logger.info('Started');
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      logger.info(`Server is running at port : ${process.env.PORT}`);
    });
    initializeMinIO();
  })
  .catch((err) => {
    logger.info('MONGO db connection failed !!! ', err);
  });
