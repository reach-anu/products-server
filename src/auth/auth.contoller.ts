import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  //signup user
  @Post('/signup')
  async signUp(@Body() signUpData): Promise<{ token: string }> {
    try {
      this.logger.log(`Product Data: ${JSON.stringify(signUpData)}`);
      const { name, email, password } = signUpData;
      if (!name || !email || !password) {
        throw new HttpException('All fields are required', 400);
      }
      return await this.authService.signUp(signUpData);
    } catch (error) {
      this.logger.error('Sign up failed', error);
      throw new HttpException(
        error.getResponse() || 'Failed to create product',
        error.getStatus() || 500,
      );
    }
  }

  //login user
  @Post('/login')
  async login(@Body() loginData): Promise<{ token: string }> {
    this.logger.log('Logging in user', loginData);
    const { name, email, password } = loginData;
    if (!email || !password) {
      throw new HttpException('All fields are required', 400);
    }
    try {
      return await this.authService.login(loginData);
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new HttpException(
        error.getResponse() || 'Failed to remove product',
        error.getStatus() || 500,
      );
    }
  }
}
