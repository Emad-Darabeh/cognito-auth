import { BadRequestException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    registerRequest: {
      email: string;
      password: string;
      username: string;
    },
  ) {
    return await this.authService.registerUser(registerRequest);
  }

  @Get('verify')
  async verify(
    @Query('email') email: string,
    @Query('userSub') userSub: string,
    @Query('confirmation_code') code: string,
  ) {
    return await this.authService.verifyUser(email, code, userSub);
  }

  @Post('login')
  async login(
    @Body() authenticateRequest: { email: string; password: string },
  ) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
