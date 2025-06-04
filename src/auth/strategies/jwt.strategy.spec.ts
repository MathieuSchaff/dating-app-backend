import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let usersService: UsersService;
  let configService: ConfigService;

  const mockUsersService = {
    findById: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret-key'),
  };

  beforeEach(async () => {
    // Réinitialiser les mocks
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('test-secret-key');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('constructor', () => {
    it('devrait créer une instance avec la configuration correcte', () => {
      expect(jwtStrategy).toBeDefined();
      // Le constructeur est appelé pendant la création du module
      // Vérifier que la stratégie a bien été créée
      expect(jwtStrategy).toBeInstanceOf(JwtStrategy);
    });

    it("devrait lancer une erreur si JWT_SECRET n'est pas défini", () => {
      // Arrange
      const mockConfigServiceWithoutSecret = {
        get: jest.fn().mockReturnValue(undefined),
      };

      // Act & Assert
      expect(() => {
        new JwtStrategy(
          mockConfigServiceWithoutSecret as any,
          mockUsersService as any,
        );
      }).toThrow('JWT_SECRET is not defined in environment variables');
    });
  });

  describe('validate', () => {
    it('devrait valider un utilisateur actif', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '123456',
        email: 'test@example.com',
        userId: '123456',
      };

      const user = {
        id: '123456',
        email: 'test@example.com',
        isActive: true,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersService.findById.mockResolvedValue(user);

      // Act
      const result = await jwtStrategy.validate(payload);

      // Assert
      expect(usersService.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual({
        userId: '123456',
        email: 'test@example.com',
      });
    });

    it("devrait lancer UnauthorizedException si l'utilisateur n'existe pas", async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '999999',
        email: 'notfound@example.com',
        userId: '999999',
      };

      mockUsersService.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Utilisateur non autorisé'),
      );
    });

    it("devrait lancer UnauthorizedException si l'utilisateur est inactif", async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '123456',
        email: 'test@example.com',
        userId: '123456',
      };

      const inactiveUser = {
        id: '123456',
        email: 'test@example.com',
        isActive: false,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersService.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(jwtStrategy.validate(payload)).rejects.toThrow(
        new UnauthorizedException('Utilisateur non autorisé'),
      );
    });

    it('devrait propager les erreurs du service', async () => {
      // Arrange
      const payload: JwtPayload = {
        sub: '123456',
        email: 'test@example.com',
        userId: '123456',
      };

      const error = new Error('Erreur de base de données');
      mockUsersService.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(jwtStrategy.validate(payload)).rejects.toThrow(error);
    });
  });
});
