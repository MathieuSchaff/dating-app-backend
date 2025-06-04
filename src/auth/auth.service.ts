import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async register(registerDto: RegisterDto) {
  //   // Créer l'utilisateur
  //   const user = await this.usersService.create(registerDto);

  //   // Générer le token
  //   const token = this.generateToken(user.id, user.email);

  //   return {
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       age: user.age,
  //       gender: user.gender,
  //     },
  //     access_token: token,
  //   };
  // }
  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      const token = this.generateToken(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          gender: user.gender,
        },
        access_token: token,
      };
    } catch (err) {
      // console.error('Erreur dans AuthService.register :', err);
      // throw err; // ou throw new InternalServerErrorException()
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
  }

  async login(loginDto: LoginDto) {
    // Valider l'utilisateur
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Mettre à jour la dernière connexion
    await this.usersService.updateLastLogin(user.id);

    // Générer le token
    const token = this.generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        photos: user.photos,
      },
      access_token: token,
    };
  }

  private generateToken(userId: string, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
      userId,
    };

    return this.jwtService.sign(payload);
  }

  async validateToken(payload: JwtPayload) {
    return await this.usersService.findById(payload.userId);
  }
}
