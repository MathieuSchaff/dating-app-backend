const { MongoMemoryServer } = require('mongodb-memory-server');

async function downloadMongoDB() {
  console.log('📥 Téléchargement de MongoDB pour les tests...');

  try {
    // Créer une instance pour forcer le téléchargement
    const mongod = await MongoMemoryServer.create({
      binary: {
        downloadDir: './node_modules/.cache/mongodb-memory-server',
        skipMD5: true,
      },
    });

    console.log('✅ MongoDB téléchargé avec succès!');

    // Arrêter l'instance
    await mongod.stop();
  } catch (error) {
    console.error('❌ Erreur lors du téléchargement:', error);
    process.exit(1);
  }
}

downloadMongoDB();
