import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Force use of system binary
process.env.MONGOMS_SYSTEM_BINARY =
  "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe";
process.env.MONGOMS_VERSION = "7.0.5"; // match your installed mongod version

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
