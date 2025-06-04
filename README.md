# 💘 Dating App - Backend API

Backend Node.js/NestJS pour une application de rencontre moderne, avec authentification JWT, MongoDB, et gestion de profils utilisateurs géolocalisés.

---

## 🌟 Résumé de l'implémentation Backend

J'ai créé une architecture backend complète et sécurisée pour mon application de rencontre avec les éléments suivants :

### ✅ Fonctionnalités implémentées

#### Architecture modulaire avec Nest.js

- Module `Auth` pour l'authentification
- Module `Users` pour la gestion des utilisateurs
- Séparation claire des responsabilités

#### Authentification JWT robuste

- Inscription avec validation des données
- Connexion avec génération de token
- Protection des routes avec Passport.js
- Stratégie JWT configurée

#### Modèle utilisateur complet

- Schéma MongoDB avec toutes les propriétés nécessaires
- Support de la géolocalisation (index `2dsphere`)
- Hachage sécurisé des mots de passe
- Transformation automatique pour ne jamais exposer le mot de passe

#### Endpoints API disponibles

- `POST /api/v1/auth/register` ➜ Inscription
- `POST /api/v1/auth/login` ➜ Connexion
- `GET /api/v1/users/me` ➜ Profil utilisateur (protégé)
- `PUT /api/v1/users/me` ➜ Mise à jour du profil (protégé)
- `GET /api/v1/users/nearby` ➜ Utilisateurs à proximité (protégé)

#### Sécurité et bonnes pratiques

- Validation des données avec `class-validator`
- Gestion globale des erreurs
- CORS configuré pour les clients web et mobile
- Variables d'environnement pour la configuration

---

## 🚀 Pour démarrer

### 1. Installation

```bash
cd dating-app-backend
npm install
```

### 2. Configuration

Copier le fichier `.env.example` en `.env`, puis modifier les valeurs :

```env
MONGODB_URI=mongodb://localhost:27017/dating-app
JWT_SECRET=changez-cette-cle
PORT=3000
```

### 3. Lancement

```bash
npm run start:dev
```

L'API est accessible sur : [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

### 4. Tests rapides avec REST Client (VS Code)

Utilisez le fichier `api-examples.http` pour tester les routes via l'extension **REST Client**.

---

## 🔧 Structure du projet

```
dating-app-backend/
├── src/
│   ├── auth/
│   │   ├── dto/auth.dto.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   ├── interfaces/jwt-payload.interface.ts
│   │   ├── strategies/jwt.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── schemas/user.schema.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/filters/http-exception.filter.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
├── docker-compose.yml
├── package.json
└── README.md
```

---

## ⚖️ Points clés de sécurité implémentés

1. **Hachage des mots de passe** avec `bcrypt`
2. **JWT** avec durée configurable et signature secrète
3. **Validation des données** via DTOs `class-validator`
4. **Protection des routes sensibles** avec `Guards`
5. **Filtrage des erreurs HTTP** pour ne rien exposer
6. **CORS** strictement configuré selon environnement
7. **Exclusion automatique du mot de passe** dans les réponses

---

## 🚧 Prochaines étapes

- ***

## 📄 Liens utiles

- 🚀 [Guide de démarrage rapide](./quick-start-guide.md)

---

## 👤 Auteur

Projet développé par Mathieu

Licence : MIT
