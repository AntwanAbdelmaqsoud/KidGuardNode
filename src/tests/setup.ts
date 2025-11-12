import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

jest.setTimeout(10000);

// Force use of system binary (if you have mongod installed locally)
process.env.MONGOMS_SYSTEM_BINARY =
  "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe";
process.env.MONGOMS_VERSION = "7.0.5"; // match your installed mongod version

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // Create in-memory server (or use system binary if configured)
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    // How long to try selecting a server (ms)
    serverSelectionTimeoutMS: 120000,
    // How long to allow socket to connect (ms)
    connectTimeoutMS: 120000,
  } as mongoose.ConnectOptions);
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
