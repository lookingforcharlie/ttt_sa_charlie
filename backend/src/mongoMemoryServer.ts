import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import logger from './logger';

async function mongoConnect() {
  const mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    dbName: 'scoreboard',
  });

  logger.info(`MongoDB successfully connected to URI: ${mongoUri}`);
  console.log(`MongoDB successfully connected to ${mongoUri}`);
}

export default mongoConnect;
