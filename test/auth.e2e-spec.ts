import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegisterDto, LoginDto } from '../src/auth/dto/auth.dto';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    email: 'e2e-test@example.com',
    password: 'Test123!',
    firstName: 'E2E',
    lastName: 'Test',
    age: 25,
    gender: 'male',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configuration similaire à main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('devrait créer un nouvel utilisateur avec succès', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.firstName).toBe(testUser.firstName);
          expect(res.body.user).not.toHaveProperty('password');
          authToken = res.body.access_token;
        });
    });

    it('devrait échouer avec un email déjà utilisé', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(testUser)
        .expect(409)
        .expect((res) => {
          expect(res.body.message).toContain('existe déjà');
        });
    });

    it('devrait échouer avec des données invalides', () => {
      const invalidUser = {
        email: 'not-an-email',
        password: '123', // trop court
        firstName: 'A', // trop court
        lastName: 'B', // trop court
        age: 15, // trop jeune
        gender: 'invalid',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBeInstanceOf(Array);
          expect(res.body.message.length).toBeGreaterThan(0);
        });
    });

    it('devrait échouer avec des données manquantes', () => {
      const incompleteUser = {
        email: 'incomplete@example.com',
        password: 'Test123!',
        // firstName manquant
        lastName: 'Test',
        age: 25,
        gender: 'male',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(incompleteUser)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('devrait connecter un utilisateur avec succès', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(testUser.email);
          expect(res.body.user.firstName).toBe(testUser.firstName);
          expect(res.body.user).toHaveProperty('bio');
          expect(res.body.user).toHaveProperty('photos');
        });
    });

    it('devrait échouer avec un email incorrect', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Email ou mot de passe incorrect');
        });
    });

    it('devrait échouer avec un mot de passe incorrect', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Email ou mot de passe incorrect');
        });
    });

    it('devrait échouer avec des données invalides', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email: 'not-an-email',
          password: '',
        })
        .expect(400);
    });
  });

  describe('Routes protégées', () => {
    it('devrait accéder au profil avec un token valide', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.firstName).toBe(testUser.firstName);
          expect(res.body).toHaveProperty('location');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('devrait échouer sans token', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toContain('Token invalide ou expiré');
        });
    });

    it('devrait échouer avec un token invalide', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('devrait mettre à jour le profil avec succès', () => {
      const updateData = {
        firstName: 'Updated',
        bio: 'Nouvelle bio de test',
        age: 26,
      };

      return request(app.getHttpServer())
        .put('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.firstName).toBe(updateData.firstName);
          expect(res.body.bio).toBe(updateData.bio);
          expect(res.body.age).toBe(updateData.age);
        });
    });

    it('devrait récupérer les utilisateurs à proximité', () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/nearby')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          // Vérifier que l'utilisateur actuel n'est pas dans la liste
          const currentUserInList = res.body.find(
            (user: any) => user.email === testUser.email,
          );
          expect(currentUserInList).toBeUndefined();
        });
    });
  });
});
