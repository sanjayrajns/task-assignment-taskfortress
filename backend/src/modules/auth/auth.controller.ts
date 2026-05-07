import { Request, Response } from 'express';
import { authService } from './auth.service';
import { sendSuccess } from '../../common/utils';

/**
 * Auth controller — thin layer that handles HTTP concerns only.
 * All business logic is delegated to AuthService.
 */
export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    sendSuccess(res, 201, 'User registered successfully', result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    sendSuccess(res, 200, 'Login successful', result);
  }
}

export const authController = new AuthController();
