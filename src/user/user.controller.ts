import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }
}
