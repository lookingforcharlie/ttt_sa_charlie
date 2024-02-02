import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import logger from './logger';

async function mongoConnect() {
  // create a server and get an URI from it
  // this line will create an in-memory mongoDB server, every time I restart the server
  // And I save the server object inside a variable
  const mongoServer = await MongoMemoryServer.create();

  // From mongoServer variable, I can get the URI of the server as follow
  const mongoUri = mongoServer.getUri();

  // Once we have the uri, I can specify the URI to te Mongoose
  await mongoose.connect(mongoUri, {
    dbName: 'scoreboard',
  });

  logger.info(`MongoDB successfully connected to URI: ${mongoUri}`);
  console.log(`MongoDB successfully connected to ${mongoUri}`);
}

export default mongoConnect;
