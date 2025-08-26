import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorator/public.decorator';
import { AuthLoginDto, AuthPayload, CreateUserDto } from '@full-stack/utils';
import { AuthService } from './auth.service';
import { AuthJwtRefreshGuard } from '../../common/guard/jwt.refresh.guard';
import { AuthUser } from '../../common/decorator/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  public login(@Body() payload: AuthLoginDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post('register')
  public register(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @Public()
  @UseGuards(AuthJwtRefreshGuard)
  @Get('refresh')
  public refreshTokens(@AuthUser() user: AuthPayload) {
    return this.authService.generateTokens(user);
  }
}
