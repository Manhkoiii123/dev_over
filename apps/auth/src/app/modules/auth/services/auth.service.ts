import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import {
  AuthTcpResponse,
  LoginBodyTcpRequest,
  RegisterBodyTcpRequest,
} from '@common/interfaces/tcp/auth';
import { HashingService } from '../../../shared/service/hashing.service';
import { AccessTokenPayloadCreate } from '../../../shared/types/jwt.type';
import { TokenService } from '../../../shared/service/token.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService
  ) {}
  async register(data: RegisterBodyTcpRequest) {
    const user = await this.authRepository.existsWithEmailOrUsername(
      data.email,
      data.username
    );
    if (user) {
      throw new BadRequestException('User already exists');
    }

    data.password = await this.hashingService.hash(data.password);

    return this.authRepository.createUser(data);
  }

  async login(data: LoginBodyTcpRequest & { userAgent: string; ip: string }) {
    console.log('🚀 ~ AuthService ~ login ~ data:', data);
    const user = await this.authRepository.existsWithEmail(data.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const isPasswordValid = await this.hashingService.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          errors: 'Invalid password',
        },
      ]);
    }

    const device = await this.authRepository.createDevice({
      userId: user.id,
      userAgent: data.userAgent,
      ip: data.ip,
    });

    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
    });

    return tokens;
  }

  async generateTokens({ userId, deviceId }: AccessTokenPayloadCreate) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({
        userId,
        deviceId,
      }),
      this.tokenService.signRefreshToken({ userId }),
    ]);
    const decodedRefreshToken = await this.tokenService.verifyAccessToken(
      refreshToken
    );
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000),
      deviceId,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
