# 📚 Documentation API - Dating App Backend

## 🌐 Informations Générales

### Base URL
```
http://localhost:3000/api/v1
```

### Headers Communs
```http
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  # Pour les routes protégées
```

### Format des Réponses
Toutes les réponses sont en JSON. Les timestamps sont en ISO 8601.

---

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Flow d'Authentification
1. L'utilisateur s'inscrit ou se connecte
2. Le serveur retourne un `access_token`
3. Le client inclut ce token dans le header `Authorization` pour les requêtes protégées
4. Le token expire après 7 jours

### Stockage Recommandé (Next.js)
- **Cookies httpOnly** pour une sécurité maximale
- **localStorage** acceptable pour le développement
- Ne JAMAIS stocker dans le code ou dans des variables globales

---

## 📡 Endpoints API

### 1. Inscription

**Endpoint:** `POST /auth/register`  
**Auth Required:** Non  
**Description:** Créer un nouveau compte utilisateur

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "MinimumSix123",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "gender": "male",  // "male", "female", "other"
  "bio": "Description optionnelle (max 500 caractères)"
}
```

#### Success Response (201)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "gender": "male"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Responses
- **400 Bad Request** - Validation échouée
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters",
    "age must not be less than 18"
  ],
  "error": "Bad Request"
}
```

- **409 Conflict** - Email déjà utilisé
```json
{
  "statusCode": 409,
  "message": "Un utilisateur avec cet email existe déjà",
  "error": "Conflict"
}
```

---

### 2. Connexion

**Endpoint:** `POST /auth/login`  
**Auth Required:** Non  
**Description:** Se connecter avec email/mot de passe

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "MinimumSix123"
}
```

#### Success Response (200)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "age": 25,
    "gender": "male",
    "bio": "Ma description",
    "photos": []
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Error Response
- **401 Unauthorized** - Identifiants incorrects
```json
{
  "statusCode": 401,
  "message": "Email ou mot de passe incorrect",
  "error": "Unauthorized"
}
```

---

### 3. Profil Utilisateur

**Endpoint:** `GET /users/me`  
**Auth Required:** ✅ Oui  
**Description:** Récupérer le profil de l'utilisateur connecté

#### Headers Required
```http
Authorization: Bearer <JWT_TOKEN>
```

#### Success Response (200)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "age": 25,
  "gender": "male",
  "bio": "Passionné de voyages et de cuisine",
  "photos": [],
  "location": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]  // [longitude, latitude]
  },
  "isActive": true,
  "isVerified": false,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Error Response
- **401 Unauthorized** - Token invalide ou expiré
```json
{
  "statusCode": 401,
  "message": "Token invalide ou expiré",
  "error": "Unauthorized"
}
```

---

### 4. Mise à Jour du Profil

**Endpoint:** `PUT /users/me`  
**Auth Required:** ✅ Oui  
**Description:** Mettre à jour le profil utilisateur

#### Request Body (tous les champs sont optionnels)
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 26,
  "bio": "Nouvelle description",
  "coordinates": [2.3522, 48.8566]  // [longitude, latitude]
}
```

#### Success Response (200)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "age": 26,
  "gender": "male",
  "bio": "Nouvelle description",
  "photos": [],
  "location": {
    "type": "Point",
    "coordinates": [2.3522, 48.8566]
  },
  "isActive": true,
  "isVerified": false,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### 5. Utilisateurs à Proximité

**Endpoint:** `GET /users/nearby`  
**Auth Required:** ✅ Oui  
**Description:** Récupérer les utilisateurs dans un rayon de 50km

#### Success Response (200)
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "age": 23,
    "gender": "female",
    "bio": "Amatrice de musique et de danse",
    "photos": ["url1", "url2"],
    "location": {
      "type": "Point",
      "coordinates": [2.3488, 48.8534]
    },
    "isActive": true,
    "isVerified": true,
    "createdAt": "2024-01-10T10:00:00.000Z"
  },
  // ... autres utilisateurs
]
```

**Note:** L'utilisateur connecté n'apparaît jamais dans cette liste.

---

## 🔴 Gestion des Erreurs

### Codes d'Erreur HTTP

| Code | Signification | Cas d'usage |
|------|--------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée (inscription) |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token invalide/expiré ou identifiants incorrects |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Email déjà utilisé |
| 500 | Server Error | Erreur serveur |

### Format Standard des Erreurs
```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/v1/auth/register",
  "method": "POST",
  "error": "Bad Request",
  "message": "Description de l'erreur"
}
```

---

## 🎨 Modèles de Données

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bio?: string;
  photos: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### AuthResponse Model
```typescript
interface AuthResponse {
  user: Partial<User>;
  access_token: string;
}
```

---

## 💡 Exemples d'Implémentation Next.js

### 1. Service API (avec Axios)
```typescript
// services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Service Authentification
```typescript
// services/auth.service.ts
import api from './api';

export const authService = {
  async register(data: RegisterDto) {
    const response = await api.post('/auth/register', data);
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  async login(data: LoginDto) {
    const response = await api.post('/auth/login', data);
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('access_token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
```

### 3. Hook Custom pour l'Utilisateur
```typescript
// hooks/useUser.ts
import { useEffect, useState } from 'react';
import api from '@/services/api';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoa
ding] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authService.isAuthenticated()) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};
```

---

## 🚦 CORS Configuration

Le serveur accepte les requêtes depuis :
- `http://localhost:3001` (Next.js dev)
- `http://localhost:8081` (React Native)
- `exp://localhost:8081` (Expo)

Pour la production, ajoutez votre domaine dans la configuration CORS du backend.

---

## ⚡ Optimisations Recommandées

### 1. Mise en Cache
- Cachez le profil utilisateur après le login
- Invalidez le cache lors de la mise à jour du profil

### 2. Gestion d'État (Redux/Zustand)
```typescript
// store/authSlice.ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

### 3. Middleware d'Authentification
```typescript
// middleware.ts (Next.js 13+)
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  
  if (!token && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

---

## 📱 Considérations Mobile (React Native)

Pour React Native, utilisez :
- `AsyncStorage` ou `react-native-keychain` pour le stockage du token
- `react-native-geolocation-service` pour la géolocalisation

---

## 🔜 Fonctionnalités à Venir

Ces endpoints seront ajoutés prochainement :
- `POST /matches/like` - Liker un utilisateur
- `POST /matches/dislike` - Disliker un utilisateur
- `GET /matches` - Voir ses matchs
- `POST /photos/upload` - Upload de photos
- `DELETE /photos/:id` - Supprimer une photo
- WebSocket pour le chat en temps réel

---

## 🤝 Support

Pour toute question sur l'API :
- Vérifiez les logs du serveur
- Testez avec Postman/Insomnia
- Consultez les exemples dans `api-examples.http`