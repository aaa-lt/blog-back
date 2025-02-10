import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import ReqWithUser from './interfaces/reqWithUser.interface';
import { ApiBearerAuth, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';
import { JwtRefreshGuard } from './guards/jwtRefresh.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() data: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(data);

    const accessToken = this.authService.getAccessToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    res.setHeader(
      'Set-Cookie',
      this.authService.getCookieWithRefreshToken(refreshToken),
    );

    return { user, accessToken };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Req() req: ReqWithUser) {
    const { user, res } = req;
    const accessToken = this.authService.getAccessToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    if (res) {
      res.setHeader(
        'Set-Cookie',
        this.authService.getCookieWithRefreshToken(refreshToken),
      );
    }

    return { user, accessToken };
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth()
  @Post('logout')
  async logout(@Req() req: ReqWithUser) {
    const { user } = req;
    req.res?.setHeader(
      'Set-Cookie',
      this.authService.getCookiesForLogOut(user.id),
    );

    return;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me')
  async me(@Req() req: ReqWithUser) {
    const { user } = req;

    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth()
  @Post('refresh')
  async refresh(@Req() req: ReqWithUser) {
    const { user, res } = req;
    const accessToken = this.authService.getAccessToken(user.id);
    const refreshToken = this.authService.getRefreshToken(user.id);

    if (res) {
      res.setHeader(
        'Set-Cookie',
        this.authService.getCookieWithRefreshToken(refreshToken),
      );
    }

    return { accessToken };
  }
}
