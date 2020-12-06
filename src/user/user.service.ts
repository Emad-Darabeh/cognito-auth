import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async createNewUser(createUserDto: CreateUserDto): Promise<User> {
    const { id, username } = createUserDto;

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({ where: { id } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.userRepo.create(createUserDto);

    await this.userRepo.save(user);

    return user;
  }
}
