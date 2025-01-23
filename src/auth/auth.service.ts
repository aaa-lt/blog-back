import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  public async register(data: RegisterDto) {
    const hashPass = await hash(data.password, 10);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashPass,
      });

      // TODO
      // newUser.password = undefined;

      return newUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('User already exists', 409);
      }
      throw new HttpException('Something went wrong', 500);
    }
  }

  public async getAuthedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getByEmail(email);

      await this.verifyPassword(password, user.password);

      return user;
    } catch {
      throw new HttpException('Invalid credentials', 401);
    }
  }

  public async verifyPassword(password: string, hashedPass: string) {
    const isValid = await compare(password, hashedPass);

    if (!isValid) {
      throw new HttpException('Invalid credentials', 401);
    }
  }
}
