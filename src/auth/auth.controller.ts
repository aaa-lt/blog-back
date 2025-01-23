import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import ReqWithUser from './interfaces/reqWithUser.interface';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Req() req: ReqWithUser) {
    const { user, res } = req;
    const cookie = this.authService.getCookieWithJwtToken(user.id);

    if (res) {
      res.setHeader('Set-Cookie', cookie);
    }

    return user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: ReqWithUser) {
    req.res?.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());

    return;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('me')
  async me(@Req() req: ReqWithUser) {
    const { user } = req;

    return user;
  }
}
