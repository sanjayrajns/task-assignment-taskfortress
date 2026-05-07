import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { AppError } from '../../common/errors';
import { Role } from '../../common/constants';
import { userRepository } from '../users';
import { JwtPayload } from '../../common/middleware';
import { RegisterDto, LoginDto } from './auth.dto';

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

/**
 * Auth service — all authentication business logic lives here.
 * Controllers never touch bcrypt, jwt, or the repository directly.
 */
export class AuthService {
  /**
   * Register a new user.
   * - Checks for duplicate email
   * - Hashes password
   * - Generates JWT
   */
  async register(dto: RegisterDto): Promise<AuthResult> {
    const existingUser = await userRepository.existsByEmail(dto.email);
    if (existingUser) {
      throw AppError.conflict('A user with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, env.bcryptSaltRounds);

    const user = await userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      role: dto.role,
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  /**
   * Authenticate with email/password.
   * - Verifies credentials
   * - Returns JWT
   */
  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(dto.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(payload: JwtPayload): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as any,
    });
  }
}

export const authService = new AuthService();
