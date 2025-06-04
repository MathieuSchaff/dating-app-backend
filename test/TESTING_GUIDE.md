# 🧪 Guide des Tests - Dating App Backend

## 📋 Vue d'ensemble

Notre suite de tests comprend :

- **Tests unitaires** : Testent les services et controllers individuellement
- **Tests E2E** : Testent l'API complète avec de vraies requêtes HTTP
- **Coverage** : Objectif de 80% de couverture de code

## 🚀 Installation des dépendances de test

```bash
npm install --save-dev \
  @nestjs/testing \
  @types/jest \
  @types/supertest \
  jest \
  mongodb-memory-server \
  supertest \
  ts-jest
```

## 📁 Structure des tests

```
dating-app-backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.spec.ts
│   │   └── strategies/jwt.strategy.spec.ts
│   └── users/
│       ├── users.controller.spec.ts
│       └── users.service.spec.ts
├── test/
│   ├── setup.ts
│   ├── jest-e2e.json
│   └── auth.e2e-spec.ts
├── jest.config.js
└── package.json
```

## 🏃 Commandes de test

### Tests unitaires

```bash
# Lancer tous les tests unitaires
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec couverture de code
npm run test:cov

# Un fichier spécifique
npm test auth.service.spec.ts
```

### Tests E2E

```bash
# Lancer les tests E2E
npm run test:e2e

# Test E2E spécifique
npm run test:e2e auth.e2e-spec
```

### Debugging

```bash
# Debug des tests (avec Chrome DevTools)
npm run test:debug
```

## 📊 Rapport de couverture

Après `npm run test:cov`, ouvrez :

```bash
open coverage/lcov-report/index.html
```

## ✅ Ce qui est testé

### 1. **AuthService**

- ✅ Inscription d'un nouvel utilisateur
- ✅ Génération du JWT lors de l'inscription
- ✅ Gestion des erreurs d'inscription
- ✅ Connexion avec identifiants valides
- ✅ Rejet des identifiants invalides
- ✅ Mise à jour de la dernière connexion
- ✅ Validation du token JWT

### 2. **UsersService**

- ✅ Création d'utilisateur avec hachage du mot de passe
- ✅ Prévention des doublons d'email
- ✅ Recherche par email
- ✅ Recherche par ID
- ✅ Validation des identifiants
- ✅ Mise à jour du profil
- ✅ Mise à jour de la localisation
- ✅ Recherche d'utilisateurs à proximité

### 3. **Controllers**

- ✅ Validation des DTOs
- ✅ Gestion des erreurs HTTP
- ✅ Protection des routes avec JWT
- ✅ Transformation des réponses

### 4. **JWT Strategy**

- ✅ Configuration avec secret
- ✅ Validation des payloads
- ✅ Rejet des utilisateurs inactifs
- ✅ Gestion des erreurs

### 5. **Tests E2E**

- ✅ Flow complet d'inscription
- ✅ Flow complet de connexion
- ✅ Accès aux routes protégées
- ✅ Mise à jour du profil
- ✅ Gestion des erreurs 400, 401, 409

## 🎯 Bonnes pratiques appliquées

### 1. **Isolation des tests**

- Chaque test est indépendant
- Base de données en mémoire pour les tests
- Mocks pour les dépendances externes

### 2. **Arrange-Act-Assert (AAA)**

```typescript
it('should do something', () => {
  // Arrange - Préparer les données
  const input = { ... };

  // Act - Exécuter l'action
  const result = service.method(input);

  // Assert - Vérifier le résultat
  expect(result).toEqual(expected);
});
```

### 3. **Descriptions claires**

- Tests groupés par fonctionnalité
- Descriptions en français
- Cas nominaux et cas d'erreur

### 4. **Mocking approprié**

```typescript
const mockUsersService = {
  create: jest.fn(),
  findById: jest.fn(),
  // ... autres méthodes
};
```

## 🐛 Résolution de problèmes

### Erreur MongoDB Memory Server

```bash
# Nettoyer le cache
rm -rf node_modules/.cache/mongodb-memory-server

# Réinstaller
npm install --save-dev mongodb-memory-server
```

### Tests qui timeout

```typescript
// Augmenter le timeout dans setup.ts
jest.setTimeout(30000); // 30 secondes
```

### Problèmes de types TypeScript

```bash
# Vérifier les types
npm run type-check

# Nettoyer et reconstruire
npm run clean && npm run build
```

## 📈 Améliorer la couverture

Pour voir les lignes non couvertes :

```bash
npm run test:cov -- --verbose
```

Zones typiques à couvrir :

- Cas d'erreur edge
- Branches conditionnelles
- Validations de données
- Gestion des exceptions

## 🔄 CI/CD Integration

### GitHub Actions exemple

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:cov
      - run: npm run test:e2e
```

## 🚦 Prochaines étapes

1. **Ajouter des tests pour les futures fonctionnalités** :

   - Tests pour le système de matching
   - Tests pour l'upload de photos
   - Tests pour le chat WebSocket

2. **Tests de performance** :

   - Tests de charge avec Artillery
   - Tests de stress pour MongoDB

3. **Tests de sécurité** :
   - Injection SQL/NoSQL
   - XSS
   - CSRF

## 💡 Tips

- Lancez les tests avant chaque commit
- Visez 80%+ de couverture
- Testez d'abord les cas d'erreur
- Mockez les services externes
- Utilisez des fixtures pour les données de test
