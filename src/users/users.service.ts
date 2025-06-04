import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, UpdateProfileDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(registerDto: RegisterDto): Promise<UserDocument> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userModel.findOne({
      email: registerDto.email.toLowerCase(),
    });

    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Créer le nouvel utilisateur
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      email: registerDto.email.toLowerCase(),
    });

    return await newUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserDocument> {
    const user = await this.findById(userId);

    // Si des coordonnées sont fournies, mettre à jour la localisation
    if (updateProfileDto.coordinates) {
      user.location = {
        type: 'Point',
        coordinates: updateProfileDto.coordinates,
      };
      delete updateProfileDto.coordinates;
    }

    // Mettre à jour les autres champs
    Object.assign(user, updateProfileDto);

    return await user.save();
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async findNearbyUsers(
    userId: string,
    maxDistance: number = 50000,
  ): Promise<UserDocument[]> {
    const currentUser = await this.findById(userId);

    return this.userModel
      .find({
        _id: { $ne: userId },
        isActive: true,
        location: {
          $near: {
            $geometry: currentUser.location,
            $maxDistance: maxDistance, // en mètres
          },
        },
      })
      .limit(100)
      .exec();
  }
}
