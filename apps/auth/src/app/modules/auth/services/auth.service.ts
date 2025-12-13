import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import {
  AuthTcpResponse,
  LoginBodyTcpRequest,
  RefreshTokenBodyTcpRequest,
  RegisterBodyTcpRequest,
  SendOtpBodyTcpRequest,
} from '@common/interfaces/tcp/auth';
import { HashingService } from '../../../shared/service/hashing.service';
import { AccessTokenPayloadCreate } from '../../../shared/types/jwt.type';
import { TokenService } from '../../../shared/service/token.service';
import { TypeOfVerificationCode } from '@common/constants/enum/type-verification-code.enum';
import { generateOTP } from '@common/utils/generate-otp.utils';
import envConfig from '../../../shared/config';
import ms from 'ms';
import { addMilliseconds } from 'date-fns';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService
  ) {}

  async validateVerificationCode({
    email,
    code,
    type,
  }: {
    email: string;
    code: string;
    type: TypeOfVerificationCode;
  }) {
    const verifycationCode =
      await this.authRepository.findUniqueVerificationCode({
        email_type_code: {
          email: email,
          type: type,
          code: code,
        },
      });

    if (!verifycationCode) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.InvalidOTP',
          path: 'code',
        },
      ]);
    }
    if (verifycationCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.OTPExpired',
          path: 'code',
        },
      ]);
    }
    return verifycationCode;
  }

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

  async sendOtp(data: SendOtpBodyTcpRequest) {
    const user = await this.authRepository.existsWithEmail(data.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (data.type === TypeOfVerificationCode.EMAIL_CONFIRMATION && user) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.EmailExists',
          path: 'refreshToken',
        },
      ]);
    }
    if (data.type === TypeOfVerificationCode.PASSWORD_RESET && !user) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.EmailNotFound',
          path: 'refreshToken',
        },
      ]);
    }

    const code = generateOTP();
    await this.authRepository.createVerificationCode({
      email: data.email,
      code,
      type: data.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    });
    return {
      message: 'OTP sent successfully',
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
}
