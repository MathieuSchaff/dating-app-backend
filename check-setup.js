const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration du backend...\n');

let errors = 0;

// Vérifier le fichier .env
if (!fs.existsSync('.env')) {
  console.error("❌ Le fichier .env n'existe pas");
  console.log('   → Créez-le en copiant .env.example : cp .env.example .env');
  errors++;
} else {
  console.log('✅ Fichier .env trouvé');

  // Vérifier les variables d'environnement requises
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_EXPIRATION', 'PORT'];

  requiredVars.forEach((varName) => {
    if (!envContent.includes(varName)) {
      console.error(`❌ Variable ${varName} manquante dans .env`);
      errors++;
    }
  });
}

// Vérifier la structure des dossiers
const requiredDirs = [
  'src/auth',
  'src/auth/dto',
  'src/auth/guards',
  'src/auth/interfaces',
  'src/auth/strategies',
  'src/users',
  'src/users/schemas',
  'src/common',
  'src/common/filters',
];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`❌ Dossier manquant : ${dir}`);
    errors++;
  }
});

// Vérifier les fichiers importants
const requiredFiles = [
  { path: 'src/main.ts', name: "Point d'entrée principal" },
  { path: 'src/app.module.ts', name: 'Module principal' },
  { path: 'src/auth/auth.module.ts', name: "Module d'authentification" },
  { path: 'src/auth/auth.service.ts', name: "Service d'authentification" },
  {
    path: 'src/auth/auth.controller.ts',
    name: "Controller d'authentification",
  },
  { path: 'src/auth/strategies/jwt.strategy.ts', name: 'Stratégie JWT' },
  { path: 'src/users/users.service.ts', name: 'Service utilisateurs' },
  { path: 'src/users/users.module.ts', name: 'Module utilisateurs' },
  { path: 'src/users/schemas/user.schema.ts', name: 'Schéma utilisateur' },
];

console.log('\n📁 Vérification des fichiers...');
requiredFiles.forEach((file) => {
  if (!fs.existsSync(file.path)) {
    console.error(`❌ Fichier manquant : ${file.name} (${file.path})`);
    errors++;
  } else {
    // Vérifier que le fichier n'est pas vide
    const content = fs.readFileSync(file.path, 'utf8');
    if (content.trim().length === 0) {
      console.error(`❌ Fichier vide : ${file.name} (${file.path})`);
      errors++;
    } else {
      console.log(`✅ ${file.name}`);
    }
  }
});

// Vérifier package.json
console.log('\n📦 Vérification des dépendances...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    '@nestjs/common',
    '@nestjs/core',
    '@nestjs/mongoose',
    '@nestjs/jwt',
    '@nestjs/passport',
    'mongoose',
    'passport',
    'passport-jwt',
    'bcrypt',
    'class-validator',
    'class-transformer',
  ];

  const installedDeps = Object.keys(packageJson.dependencies || {});
  const missingDeps = requiredDeps.filter(
    (dep) => !installedDeps.includes(dep),
  );

  if (missingDeps.length > 0) {
    console.error('❌ Dépendances manquantes :', missingDeps.join(', '));
    console.log('   → Installez-les avec : npm install');
    errors++;
  } else {
    console.log('✅ Toutes les dépendances requises sont présentes');
  }
} else {
  console.error('❌ Fichier package.json manquant');
  errors++;
}

// Résumé
console.log('\n' + '='.repeat(50));
if (errors === 0) {
  console.log('✅ Tout est correctement configuré !');
  console.log('🚀 Vous pouvez démarrer avec : npm run start:dev');
} else {
  console.log(`❌ ${errors} erreur(s) trouvée(s)`);
  console.log('📝 Corrigez les erreurs ci-dessus avant de continuer');
}
console.log('='.repeat(50) + '\n');
