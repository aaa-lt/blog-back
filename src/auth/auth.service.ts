import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { InvalidCredentialsException } from './exeptions/invalidCredentials.exeption';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(data: RegisterDto) {
    const hashPass = await hash(data.password, 10);

    try {
      const newUser = await this.usersService.create({
        ...data,
        password: hashPass,
      });

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
      throw new InvalidCredentialsException();
    }
  }

  public async verifyPassword(password: string, hashedPass: string) {
    const isValid = await compare(password, hashedPass);

    if (!isValid) {
      throw new InvalidCredentialsException();
    }
  }

  public getCookieWithJwtToken(userId: string) {
    {
      const payload: TokenPayload = { userId };
      const token = this.jwtService.sign(payload);

      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_EXPIRATION_TIME',
      )}`;
    }
  }

  public getCookiesForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
