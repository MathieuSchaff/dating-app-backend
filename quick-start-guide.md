# 🚀 Guide de démarrage rapide - Backend Dating App

## 1. Prérequis

- Node.js 18+ installé
- MongoDB installé et démarré (ou MongoDB Atlas)
- Git

## 2. Installation

```bash
# Cloner le projet (si nécessaire)
git clone <votre-repo>
cd dating-app-backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env
```

## 3. Configuration

Modifiez le fichier `.env` avec vos valeurs :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/dating-app
# Ou pour MongoDB Atlas :
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dating-app

# JWT
JWT_SECRET=changez-cette-cle-secrete-en-production
JWT_EXPIRATION=7d

# Application
PORT=3000
```

## 4. Vérification de la structure

Assurez-vous que tous les fichiers sont bien créés :

```
src/
├── auth/
│   ├── dto/auth.dto.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── interfaces/jwt-payload.interface.ts
│   ├── strategies/jwt.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── users/
│   ├── schemas/user.schema.ts
│   ├── users.controller.ts
│   ├── users.module.ts
│   └── users.service.ts
├── common/
│   └── filters/http-exception.filter.ts
├── app.module.ts
└── main.ts
```

## 5. Démarrage

```bash
# Mode développement
npm run start:dev

# L'API sera disponible sur :
# http://localhost:3000/api/v1
```

## 6. Test rapide avec cURL

### Inscription
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "gender": "male"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Copiez le token JWT retourné pour les requêtes suivantes.

### Profil utilisateur
```bash
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer VOTRE_TOKEN_JWT"
```

## 7. Dépannage

### Erreur "JWT_SECRET is not defined"
- Vérifiez que le fichier `.env` existe et contient `JWT_SECRET`
- Redémarrez le serveur après avoir créé/modifié le `.env`

### Erreur de connexion MongoDB
- Vérifiez que MongoDB est démarré : `mongod`
- Vérifiez l'URL de connexion dans `.env`

### Port déjà utilisé
- Changez le port dans `.env` ou arrêtez le processus sur le port 3000

## 8. Outils recommandés

- **Postman** ou **Insomnia** pour tester l'API
- **MongoDB Compass** pour visualiser la base de données
- **Extension VS Code "REST Client"** pour utiliser le fichier `api-examples.http`

## 9. Prochaines étapes

✅ Backend de base fonctionnel
⏳ Ajouter les tests unitaires
⏳ Implémenter le système de matching
⏳ Ajouter la gestion des photos
⏳ Implémenter le chat temps réel
⏳ Configurer le frontend Next.js
⏳ Configurer l'app mobile React Native