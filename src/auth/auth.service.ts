import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcryptjs';
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

  public getCookieWithRefreshToken(token: string) {
    {
      return `RefreshToken=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
        'JWT_REFRESH_EXPIRATION_TIME',
      )}`;
    }
  }

  public getAccessToken(userId: string) {
    const payload: TokenPayload = { userId };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  public getRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    this.usersService.setCurrentRefreshToken(token, userId);

    return token;
  }

  public getCookiesForLogOut(userid: string) {
    this.usersService.removeCurrentRefreshToken(userid);

    return `RefreshToken=; HttpOnly; Path=/; Max-Age=0`;
  }
}
