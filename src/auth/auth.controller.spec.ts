import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait appeler authService.register et retourner le résultat', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
      };

      const expectedResult = {
        user: {
          id: '123456',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          age: 25,
          gender: 'male',
        },
        access_token: 'jwt.token.here',
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      // Act
      const result = await authController.register(registerDto);

      // Assert
      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });

    it('devrait propager les erreurs du service', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
      };

      const error = new Error('Registration failed');
      mockAuthService.register.mockRejectedValue(error);

      // Act & Assert
      await expect(authController.register(registerDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('devrait appeler authService.login et retourner le résultat', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const expectedResult = {
        user: {
          id: '123456',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          age: 25,
          gender: 'male',
          bio: 'Test bio',
          photos: [],
        },
        access_token: 'jwt.token.here',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await authController.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });

    it('devrait propager UnauthorizedException du service', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const error = new UnauthorizedException(
        'Email ou mot de passe incorrect',
      );
      mockAuthService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(authController.login(loginDto)).rejects.toThrow(error);
    });
  });
});
