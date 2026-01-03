import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import {
  LoginBodyTcpRequest,
  RefreshTokenBodyTcpRequest,
  RegisterBodyTcpRequest,
  ResetPasswordTcpRequest,
} from '@common/interfaces/tcp/auth';
import { HashingService } from '../../../shared/service/hashing.service';
import { AccessTokenPayloadCreate } from '../../../shared/types/jwt.type';
import { TokenService } from '../../../shared/service/token.service';
import { USER_STATUS } from '@common/constants/enum/user-status.enum';

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

  async login(data: LoginBodyTcpRequest) {
    const user = await this.authRepository.existsWithEmail(data.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }
    const isPasswordValid = await this.hashingService.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Username or password is incorrect');
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

  async refreshToken({
    refreshToken,
    userAgent,
    ip,
  }: RefreshTokenBodyTcpRequest) {
    const { userId } = await this.tokenService.verifyRefreshToken(refreshToken);
    const refreshTokenDb = await this.authRepository.findRefreshToken({
      token: refreshToken,
    });
    if (!refreshTokenDb) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const { deviceId } = refreshTokenDb;
    const updateDevide = this.authRepository.updateDevice(deviceId, {
      ip,
      userAgent,
    });
    const deleteRefreshToken =
      this.authRepository.deleteRefreshToken(refreshToken);

    const newtokens = this.generateTokens({
      userId,
      deviceId,
    });
    const [, , tokens] = await Promise.all([
      updateDevide,
      deleteRefreshToken,
      newtokens,
    ]);
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.tokenService.verifyRefreshToken(refreshToken);
    const deleteRefreshToken = await this.authRepository.deleteRefreshToken(
      refreshToken
    );
    await this.authRepository.updateDevice(deleteRefreshToken.deviceId, {
      isActive: false,
    });
    return {
      message: 'Logout successfully',
    };
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

  async activeUser(email: string) {
    return this.authRepository.activeUser(email);
  }

  async resetPassword(body: ResetPasswordTcpRequest) {
    const { password, email } = body;

    const hashPass = await this.hashingService.hash(password);

    const user = await this.authRepository.existsWithEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    await this.authRepository.updateUser(user.id, {
      password: hashPass,
    });

    return 'Password updated successfully';
  }
}
