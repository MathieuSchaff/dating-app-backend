// Configuration globale pour les tests
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer;

// Augmenter le timeout pour les tests
jest.setTimeout(60000);

// Avant tous les tests
global.beforeAll(async () => {
  try {
    // Créer une instance MongoDB en mémoire
    mongod = await MongoMemoryServer.create({
      binary: {
        downloadDir: './node_modules/.cache/mongodb-memory-server',
      },
    });
    const uri = mongod.getUri();

    // Connecter mongoose à la base de données en mémoire
    await mongoose.connect(uri);
  } catch (error) {
    console.error('Failed to start MongoDB Memory Server:', error);
    throw error;
  }
});

// Après chaque test
global.afterEach(async () => {
  // Nettoyer toutes les collections
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
});

// Après tous les tests
global.afterAll(async () => {
  try {
    // Fermer la connexion et arrêter MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error during teardown:', error);
  }
});
