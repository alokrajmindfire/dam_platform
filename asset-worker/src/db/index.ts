import mongoose from 'mongoose';
import logger from '../utils/logger';

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.info('MONGODB connection close FAILED ', error);
    process.exit(1);
  }
};
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`,
    );
    logger.info(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    logger.log('MONGODB connection FAILED ', error);
    process.exit(1);
  }
};

export default connectDB;
