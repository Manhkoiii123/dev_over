import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Headers, Inject, Ip, Post } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';

import {
  AuthResponseDto,
  RegisterBodyDto,
  AuthLoginResponseDto,
  LoginBodyDto,
  AuthRefreshTokenResponseDto,
  RefreshTokenBodyDto,
} from '@common/interfaces/gateway/auth';
import {
  AuthTcpResponse,
  RegisterBodyTcpRequest,
  LoginBodyTcpRequest,
  LoginTcpResponse,
  RefreshTokenTcpResponse,
  RefreshTokenBodyTcpRequest,
} from '@common/interfaces/tcp/auth';

import {
  SendOtpBodyTcpRequest,
  ValidateVerificationCodeBodyTcpRequest,
} from '@common/interfaces/tcp/verification';

import { map, switchMap } from 'rxjs';
import {
  SendOtpBodyDto,
  ValidateVerificationCodeDto,
} from '@common/interfaces/gateway/verification';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TCP_SERVICES.AUTH_SERVICE)
    private readonly authClient: TcpClient,
    @Inject(TCP_SERVICES.MAIL_SERVICE)
    private readonly mailClient: TcpClient
  ) {}

  @Post('register')
  @ApiOkResponse({ type: ResponseDto<AuthResponseDto> })
  @ApiOperation({ summary: 'Register' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async register(
    @Body() body: RegisterBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.authClient
      .send<AuthTcpResponse, RegisterBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.REGISTER,
        {
          data: {
            ...body,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(
        switchMap((authResult) => {
          return this.mailClient
            .send(TCP_REQUEST_MESSAGE.MAIL.SEND_OTP, {
              data: {
                email: body.email,
                type: 'EMAIL_CONFIRMATION',
                ip,
                userAgent,
              },
              processId,
            })
            .pipe(map(() => new ResponseDto(authResult)));
        })
      );
  }

  @Post('login')
  @ApiOkResponse({ type: ResponseDto<AuthLoginResponseDto> })
  @ApiOperation({ summary: 'Login' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async login(
    @Body() body: LoginBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.authClient
      .send<LoginTcpResponse, LoginBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.LOGIN,
        {
          data: {
            ...body,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('refresh-token')
  @ApiOkResponse({ type: ResponseDto<AuthRefreshTokenResponseDto> })
  @ApiOperation({ summary: 'RefreshToken' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async refreshToken(
    @Body() body: RefreshTokenBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.authClient
      .send<RefreshTokenTcpResponse, RefreshTokenBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.REFRESH_TOKEN,
        {
          data: {
            ...body,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('logout')
  @ApiOkResponse({ type: ResponseDto<AuthRefreshTokenResponseDto> })
  @ApiOperation({ summary: 'Logout' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async logout(
    @Body() body: RefreshTokenBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.authClient
      .send<RefreshTokenTcpResponse, RefreshTokenBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.LOGOUT,
        {
          data: {
            ...body,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('re-send-otp')
  @ApiOkResponse({ type: ResponseDto<{ message: string }> })
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async reSendOtp(
    @Body() body: SendOtpBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.mailClient
      .send<{ message: string }, SendOtpBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.MAIL.RESEND_OTP,
        {
          data: { ...body, userAgent, ip },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('validate-otp')
  @ApiOkResponse({ type: ResponseDto<{ message: string }> })
  @ApiOperation({ summary: 'Validate OTP' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async validateOtp(
    @Body() body: ValidateVerificationCodeDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.mailClient
      .send<{ message: string }, ValidateVerificationCodeBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.MAIL.VALIDATE_OTP,
        {
          data: { ...body, userAgent, ip },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
}
