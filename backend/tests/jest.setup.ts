import * as mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export const connect = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
};

export const disconnect = async () => {
  if (mongo) {
    await mongoose.disconnect();
    await mongo.stop();
  }
};
