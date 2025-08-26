import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import {
  AuthLoginDto,
  CreateUserDto,
  AuthPayload,
  TokenType,
} from '@full-stack/utils';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../common/config/config.type';

@Injectable()
export class AuthService {
  @Inject()
  hashService: HashService;

  @Inject()
  userService: UserService;

  @Inject()
  jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  private authConfig: AuthConfig;

  private accessTokenSecret: string;

  private getAuthConfig() {
    if (!this.authConfig) {
      this.authConfig = this.configService.get<AuthConfig>('authConfig');
    }

    return this.authConfig;
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const findByEmail = await this.userService.getUserByEmail(email);

    if (findByEmail) {
      throw new ConflictException('user.userExistsByEmail');
    }

    const passwordHashed = this.hashService.createHash(password);
    const createdUser = await this.userService.createUser({
      ...createUserDto,
      password: passwordHashed,
    });

    const tokens = await this.generateTokens({
      id: createdUser.id,
      role: createdUser.role,
    });

    return {
      ...tokens,
      user: createdUser,
    };
  }

  async login(data: AuthLoginDto) {
    const { email, password } = data;

    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = this.hashService.match(user.password, password);

    if (!match) {
      throw new NotFoundException('Invalid password');
    }

    const { accessToken, refreshToken } = await this.generateTokens({
      id: user.id,
      role: user.role,
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: user,
    };
  }

  async verifyToken(accessToken: string) {
    this.accessTokenSecret = this.getAuthConfig().accessToken.secret;

    const data = await this.jwtService.verifyAsync(accessToken, {
      secret: this.accessTokenSecret,
    });

    return data;
  }

  async generateTokens(user: AuthPayload) {
    const authConfig = this.getAuthConfig();
    const accessTokenPromise = this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
        tokenType: TokenType.ACCESS_TOKEN,
      },
      {
        secret: authConfig.accessToken.secret,
        expiresIn: authConfig.accessToken.expirationTime,
      }
    );

    const refreshTokenPromise = this.jwtService.signAsync(
      {
        id: user.id,
        role: user.role,
        tokenType: TokenType.REFRESH_TOKEN,
      },
      {
        secret: authConfig.refreshToken.secret,
        expiresIn: authConfig.refreshToken.expirationTime,
      }
    );

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
