import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);

    await this.userRepository.save(newUser);

    return newUser;
  }

  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      return user;
    }

    throw new HttpException('User not found', 404);
  }

  // TODO
  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   console.log(updateUserDto);
  //   return `This action updates a #${id} user`;
  // }

  // async remove(id: string) {
  //   return `This action removes a #${id} user`;
  // }
}
