import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

// Mock du UsersService
const mockUsersService = {
  create: jest.fn(),
  validateUser: jest.fn(),
  updateLastLogin: jest.fn(),
  findById: jest.fn(),
};

// Mock du JwtService
const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('devrait créer un nouvel utilisateur et retourner un token', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
      };

      const createdUser = {
        id: '123456',
        ...registerDto,
        password: 'hashedPassword',
      };

      const expectedToken = 'jwt.token.here';

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '123456',
        email: 'test@example.com',
        userId: '123456',
      });
      expect(result).toEqual({
        user: {
          id: '123456',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          age: 25,
          gender: 'male',
        },
        access_token: expectedToken,
      });
    });

    it("devrait propager l'erreur si la création échoue", async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
      };

      const error = new Error('Email déjà utilisé');
      mockUsersService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(error);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it("devrait authentifier l'utilisateur et retourner un token", async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const user = {
        id: '123456',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
        bio: 'Test bio',
        photos: [],
      };

      const expectedToken = 'jwt.token.here';

      mockUsersService.validateUser.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(usersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(usersService.updateLastLogin).toHaveBeenCalledWith('123456');
      expect(result).toEqual({
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
        access_token: expectedToken,
      });
    });

    it('devrait lancer une UnauthorizedException si les identifiants sont incorrects', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Email ou mot de passe incorrect'),
      );
      expect(mockUsersService.updateLastLogin).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('validateToken', () => {
    it("devrait valider le token et retourner l'utilisateur", async () => {
      // Arrange
      const payload = {
        sub: '123456',
        email: 'test@example.com',
        userId: '123456',
      };

      const user = {
        id: '123456',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersService.findById.mockResolvedValue(user);

      // Act
      const result = await authService.validateToken(payload);

      // Assert
      expect(usersService.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual(user);
    });
  });
});
