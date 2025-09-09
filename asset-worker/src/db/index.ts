import mongoose from 'mongoose';

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.log('MONGODB connection close FAILED ', error);
    process.exit(1);
  }
};
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log('MONGODB connection FAILED ', error);
    process.exit(1);
  }
};

export default connectDB;
