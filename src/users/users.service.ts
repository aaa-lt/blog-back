import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

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

    throw new UserNotFoundException();
  }

  async getById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (user) {
      return user;
    }

    throw new UserNotFoundException();
  }

  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    const hashedToken = await hash(refreshToken, 10);

    await this.userRepository.update(userId, {
      currentRefreshToken: hashedToken,
    });
  }

  async removeCurrentRefreshToken(userId: string) {
    await this.userRepository.update(userId, {
      currentRefreshToken: null,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);

    if (user.currentRefreshToken) {
      const isMatch = await compare(refreshToken, user.currentRefreshToken);

      if (isMatch) {
        return user;
      }
    }

    return;
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
