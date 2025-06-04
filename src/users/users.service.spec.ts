import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, UpdateProfileDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

// Mock de bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: Model<UserDocument>;

  // Mock des méthodes du modèle Mongoose
  // const mockUserModel = jest.fn().mockImplementation(() => ({
  //   save: jest.fn(),
  // }));
  // const mockUserModel = {
  //   findOne: jest.fn(),
  //   findById: jest.fn(),
  //   findByIdAndUpdate: jest.fn(),
  //   find: jest.fn(),
  //   create: jest.fn(),
  //   ...jest.fn().mockImplementation(() => ({
  //     save: jest.fn(),
  //   }))(),
  // };
  // const mockUserModel = {
  //   findOne: jest.fn(),
  //   findById: jest.fn(),
  //   findByIdAndUpdate: jest.fn(),
  //   find: jest.fn(),
  //   create: jest.fn(),
  //   // Pour simuler le constructeur
  //   prototype: { save: jest.fn() },
  // };
  // const mockUserModel = jest.fn().mockImplementation(() => ({
  //   save: jest.fn(),
  //   toObject: jest.fn(),
  // }));

  // // Ajoute les méthodes statiques directement dessus
  // mockUserModel.findOne = jest.fn();
  // mockUserModel.findById = jest.fn();
  // mockUserModel.findByIdAndUpdate = jest.fn();
  // mockUserModel.find = jest.fn();
  // mockUserModel.create = jest.fn();
  class MockUserModel {
    save = jest.fn();
    static findOne = jest.fn();
    static findById = jest.fn();
    static findByIdAndUpdate = jest.fn();
    static find = jest.fn();
    static create = jest.fn();
  }

  // Mock d'un document utilisateur
  const mockUser = {
    id: '123456',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
    gender: 'male',
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566],
    },
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    // Réinitialiser les mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      age: 25,
      gender: 'male',
    };

    it('devrait créer un nouvel utilisateur avec succès', async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const savedUser = {
        ...mockUser,
        save: jest.fn().mockResolvedValue(mockUser),
        toObject: jest.fn().mockReturnValue(mockUser),
      };

      // Simuler le constructeur du modèle
      mockUserModel.prototype = savedUser;
      mockUserModel.mockImplementation(() => savedUser);

      // Act
      const result = await usersService.create(registerDto);

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(savedUser.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it("devrait lancer une ConflictException si l'email existe déjà", async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Act & Assert
      await expect(usersService.create(registerDto)).rejects.toThrow(
        new ConflictException('Un utilisateur avec cet email existe déjà'),
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('devrait retourner un utilisateur par email', async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await usersService.findByEmail('test@example.com');

      // Assert
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it("devrait retourner null si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act
      const result = await usersService.findByEmail('notfound@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      // Arrange
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const result = await usersService.findById('123456');

      // Assert
      expect(mockUserModel.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual(mockUser);
    });

    it("devrait lancer une NotFoundException si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(usersService.findById('999999')).rejects.toThrow(
        new NotFoundException('Utilisateur non trouvé'),
      );
    });
  });

  describe('validateUser', () => {
    it("devrait valider l'utilisateur avec les bons identifiants", async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await usersService.validateUser(
        'test@example.com',
        'Password123!',
      );

      // Assert
      expect(result).toEqual(mockUser);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password123!',
        'hashedPassword',
      );
    });

    it('devrait retourner null avec un mauvais mot de passe', async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await usersService.validateUser(
        'test@example.com',
        'WrongPassword',
      );

      // Assert
      expect(result).toBeNull();
    });

    it("devrait retourner null si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act
      const result = await usersService.validateUser(
        'notfound@example.com',
        'Password123!',
      );

      // Assert
      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('devrait mettre à jour le profil avec succès', async () => {
      // Arrange
      const updateDto: UpdateProfileDto = {
        firstName: 'Jane',
        bio: 'Nouvelle bio',
      };

      const userWithSave = {
        ...mockUser,
        save: jest.fn().mockResolvedValue({ ...mockUser, ...updateDto }),
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithSave),
      });

      // Act
      const result = await usersService.updateProfile('123456', updateDto);

      // Assert
      expect(userWithSave.save).toHaveBeenCalled();
      expect(result).toMatchObject(updateDto);
    });

    it('devrait mettre à jour la localisation si des coordonnées sont fournies', async () => {
      // Arrange
      const updateDto: UpdateProfileDto = {
        coordinates: [2.3488, 48.8534],
      };

      const userWithSave = {
        ...mockUser,
        location: { type: 'Point', coordinates: [0, 0] },
        save: jest.fn().mockResolvedValue({
          ...mockUser,
          location: { type: 'Point', coordinates: [2.3488, 48.8534] },
        }),
      };

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(userWithSave),
      });

      // Act
      const result = await usersService.updateProfile('123456', updateDto);

      // Assert
      expect(userWithSave.location.coordinates).toEqual([2.3488, 48.8534]);
      expect(userWithSave.save).toHaveBeenCalled();
    });
  });

  describe('updateLastLogin', () => {
    it('devrait mettre à jour la date de dernière connexion', async () => {
      // Arrange
      const mockDate = new Date('2024-01-15T10:00:00.000Z');
      jest.useFakeTimers().setSystemTime(mockDate);

      // Act
      await usersService.updateLastLogin('123456');

      // Assert
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('123456', {
        lastLogin: mockDate,
      });

      // Cleanup
      jest.useRealTimers();
    });
  });

  describe('findNearbyUsers', () => {
    it('devrait retourner les utilisateurs à proximité', async () => {
      // Arrange
      const nearbyUsers = [
        { id: '234567', firstName: 'Jane' },
        { id: '345678', firstName: 'Bob' },
      ];

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      mockUserModel.find.mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(nearbyUsers),
        }),
      });

      // Act
      const result = await usersService.findNearbyUsers('123456', 25000);

      // Assert
      expect(mockUserModel.find).toHaveBeenCalledWith({
        _id: { $ne: '123456' },
        isActive: true,
        location: {
          $near: {
            $geometry: mockUser.location,
            $maxDistance: 25000,
          },
        },
      });
      expect(result).toEqual(nearbyUsers);
    });
  });
});
