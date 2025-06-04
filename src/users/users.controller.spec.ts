// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { UpdateProfileDto } from '../auth/dto/auth.dto';

// describe('UsersController', () => {
//   let usersController: UsersController;
//   let usersService: UsersService;

//   const mockUsersService = {
//     findById: jest.fn(),
//     updateProfile: jest.fn(),
//     findNearbyUsers: jest.fn(),
//   };

//   const mockRequest = {
//     user: {
//       userId: '123456',
//       email: 'test@example.com',
//     },
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: mockUsersService,
//         },
//       ],
//     }).compile();

//     usersController = module.get<UsersController>(UsersController);
//     usersService = module.get<UsersService>(UsersService);

//     jest.clearAllMocks();
//   });

//   describe('getProfile', () => {
// it('devrait retourner le profil de l\'utilisateur connecté', async () => {
//     // Arrange
//     const expectedUser = {
//       id: '123456',
//       email: 'test@example.com',
//       firstName: 'John',
//       lastName: 'Doe',
//       age: 25,
//       gender: 'male',
//       bio: 'Test bio',
//       photos: [],
//       location: {
//         type: 'Point',
//         coordinates: [2.3522, 48.8566],
//       },
//       isActive: true,
//       isVerified: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     mockUsersService.findById.mockResolvedValue(expectedUser);

//     // Act
//     const result = await usersController.getProfile(mockRequest);

//     // Assert
//     expect(usersService.findById).toHaveBeenCalledWith('123456');
//     expect(result).toEqual(expectedUser);
//   });
//     it('devrait gérer la mise à jour de localisation', async () => {
//       // Arrange
//       const updateProfileDto: UpdateProfileDto = {
//         coordinates: [2.3488, 48.8534],
//       };

//       const updatedUser = {
//         id: '123456',
//         email: 'test@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         age: 25,
//         gender: 'male',
//         bio: 'Test bio',
//         photos: [],
//         location: {
//           type: 'Point',
//           coordinates: [2.3488, 48.8534],
//         },
//         isActive: true,
//         isVerified: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       mockUsersService.updateProfile.mockResolvedValue(updatedUser);

//       // Act
//       const result = await usersController.updateProfile(mockRequest, updateProfileDto);

//       // Assert
//       expect(usersService.updateProfile).toHaveBeenCalledWith('123456', updateProfileDto);
//       expect(result.location.coordinates).toEqual([2.3488, 48.8534]);
//     });

//     it('devrait propager les erreurs du service', async () => {
//       // Arrange
//       const updateProfileDto: UpdateProfileDto = {
//         firstName: 'Jane',
//       };

//       const error = new Error('Erreur de mise à jour');
//       mockUsersService.updateProfile.mockRejectedValue(error);

//       // Act & Assert
//       await expect(
//         usersController.updateProfile(mockRequest, updateProfileDto)
//       ).rejects.toThrow(error);
//     });
//   });

//   describe('getNearbyUsers', () => {
//     it('devrait retourner les utilisateurs à proximité', async () => {
//       // Arrange
//       const nearbyUsers = [
//         {
//           id: '234567',
//           email: 'jane@example.com',
//           firstName: 'Jane',
//           lastName: 'Smith',
//           age: 23,
//           gender: 'female',
//           bio: 'Bio de Jane',
//           photos: ['photo1.jpg'],
//           location: {
//             type: 'Point',
//             coordinates: [2.3488, 48.8534],
//           },
//           isActive: true,
//           isVerified: true,
//         },
//         {
//           id: '345678',
//           email: 'bob@example.com',
//           firstName: 'Bob',
//           lastName: 'Johnson',
//           age: 28,
//           gender: 'male',
//           bio: 'Bio de Bob',
//           photos: [],
//           location: {
//             type: 'Point',
//             coordinates: [2.3500, 48.8550],
//           },
//           isActive: true,
//           isVerified: false,
//         },
//       ];

//       mockUsersService.findNearbyUsers.mockResolvedValue(nearbyUsers);

//       // Act
//       const result = await usersController.getNearbyUsers(mockRequest);

//       // Assert
//       expect(usersService.findNearbyUsers).toHaveBeenCalledWith('123456');
//       expect(result).toEqual(nearbyUsers);
//       expect(result).toHaveLength(2);
//     });

//     it('devrait retourner un tableau vide si aucun utilisateur à proximité', async () => {
//       // Arrange
//       mockUsersService.findNearbyUsers.mockResolvedValue([]);

//       // Act
//       const result = await usersController.getNearbyUsers(mockRequest);

//       // Assert
//       expect(usersService.findNearbyUsers).toHaveBeenCalledWith('123456');
//       expect(result).toEqual([]);
//     });

//     it('devrait propager les erreurs du service', async () => {
//       // Arrange
//       const error = new Error('Erreur de géolocalisation');
//       mockUsersService.findNearbyUsers.mockRejectedValue(error);

//       // Act & Assert
//       await expect(usersController.getNearbyUsers(mockRequest)).rejects.toThrow(error);
//     });
//   });
// }); true,
//         isVerified: false,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       mockUsersService.findById.mockResolvedValue(expectedUser);

//       // Act
//       const result = await usersController.getProfile(mockRequest);

//       // Assert
//       expect(usersService.findById).toHaveBeenCalledWith('123456');
//       expect(result).toEqual(expectedUser);
//     });

//     it('devrait propager l\'erreur si l\'utilisateur n\'est pas trouvé', async () => {
//       // Arrange
//       const error = new Error('Utilisateur non trouvé');
//       mockUsersService.findById.mockRejectedValue(error);

//       // Act & Assert
//       await expect(usersController.getProfile(mockRequest)).rejects.toThrow(error);
//     });
//   });

//   describe('updateProfile', () => {
//     it('devrait mettre à jour le profil avec succès', async () => {
//       // Arrange
//       const updateProfileDto: UpdateProfileDto = {
//         firstName: 'Jane',
//         bio: 'Nouvelle bio',
//         age: 26,
//       };

//       const updatedUser = {
//         id: '123456',
//         email: 'test@example.com',
//         firstName: 'Jane',
//         lastName: 'Doe',
//         age: 26,
//         gender: 'male',
//         bio: 'Nouvelle bio',
//         photos: [],
//         location: {
//           type: 'Point',
//           coordinates: [2.3522, 48.8566],
//         },
//         isActive:

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateProfileDto } from '../auth/dto/auth.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    updateProfile: jest.fn(),
    findNearbyUsers: jest.fn(),
  };

  const mockRequest = {
    user: {
      userId: '123456',
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it("devrait retourner le profil de l'utilisateur connecté", async () => {
      const expectedUser = {
        id: '123456',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
        bio: 'Test bio',
        photos: [],
        location: {
          type: 'Point',
          coordinates: [2.3522, 48.8566],
        },
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findById.mockResolvedValue(expectedUser);

      const result = await usersController.getProfile(mockRequest);

      expect(usersService.findById).toHaveBeenCalledWith('123456');
      expect(result).toEqual(expectedUser);
    });

    it("devrait propager l'erreur si l'utilisateur n'est pas trouvé", async () => {
      const error = new Error('Utilisateur non trouvé');
      mockUsersService.findById.mockRejectedValue(error);

      await expect(usersController.getProfile(mockRequest)).rejects.toThrow(
        error,
      );
    });
  });

  describe('updateProfile', () => {
    it('devrait mettre à jour la localisation avec succès', async () => {
      const updateProfileDto: UpdateProfileDto = {
        coordinates: [2.3488, 48.8534],
      };

      const updatedUser = {
        id: '123456',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
        bio: 'Test bio',
        photos: [],
        location: {
          type: 'Point',
          coordinates: [2.3488, 48.8534],
        },
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await usersController.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        '123456',
        updateProfileDto,
      );
      expect(result.location.coordinates).toEqual([2.3488, 48.8534]);
    });

    it("devrait mettre à jour d'autres champs du profil", async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
        bio: 'Nouvelle bio',
        age: 26,
      };

      const updatedUser = {
        id: '123456',
        email: 'test@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        age: 26,
        gender: 'male',
        bio: 'Nouvelle bio',
        photos: [],
        location: {
          type: 'Point',
          coordinates: [2.3522, 48.8566],
        },
        isActive: true,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await usersController.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        '123456',
        updateProfileDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('devrait propager les erreurs du service', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'Jane',
      };

      const error = new Error('Erreur de mise à jour');
      mockUsersService.updateProfile.mockRejectedValue(error);

      await expect(
        usersController.updateProfile(mockRequest, updateProfileDto),
      ).rejects.toThrow(error);
    });
  });

  describe('getNearbyUsers', () => {
    it('devrait retourner les utilisateurs à proximité', async () => {
      const nearbyUsers = [
        {
          id: '234567',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          age: 23,
          gender: 'female',
          bio: 'Bio de Jane',
          photos: ['photo1.jpg'],
          location: {
            type: 'Point',
            coordinates: [2.3488, 48.8534],
          },
          isActive: true,
          isVerified: true,
        },
        {
          id: '345678',
          email: 'bob@example.com',
          firstName: 'Bob',
          lastName: 'Johnson',
          age: 28,
          gender: 'male',
          bio: 'Bio de Bob',
          photos: [],
          location: {
            type: 'Point',
            coordinates: [2.35, 48.855],
          },
          isActive: true,
          isVerified: false,
        },
      ];

      mockUsersService.findNearbyUsers.mockResolvedValue(nearbyUsers);

      const result = await usersController.getNearbyUsers(mockRequest);

      expect(usersService.findNearbyUsers).toHaveBeenCalledWith('123456');
      expect(result).toEqual(nearbyUsers);
      expect(result).toHaveLength(2);
    });

    it('devrait retourner un tableau vide si aucun utilisateur à proximité', async () => {
      mockUsersService.findNearbyUsers.mockResolvedValue([]);

      const result = await usersController.getNearbyUsers(mockRequest);

      expect(usersService.findNearbyUsers).toHaveBeenCalledWith('123456');
      expect(result).toEqual([]);
    });

    it('devrait propager les erreurs du service', async () => {
      const error = new Error('Erreur de géolocalisation');
      mockUsersService.findNearbyUsers.mockRejectedValue(error);

      await expect(usersController.getNearbyUsers(mockRequest)).rejects.toThrow(
        error,
      );
    });
  });
});
