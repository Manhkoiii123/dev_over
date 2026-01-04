import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Ip,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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
  GetOAuthAuthorizationUrlResponseDto,
  ResetPasswordBodyDto,
  GetMeResponseDto,
} from '@common/interfaces/gateway/auth';
import {
  AuthTcpResponse,
  RegisterBodyTcpRequest,
  LoginBodyTcpRequest,
  LoginTcpResponse,
  RefreshTokenTcpResponse,
  RefreshTokenBodyTcpRequest,
  GoogleOAuthUrlTcpResponse,
  GoogleAuthUrlTcpRequest,
  GoogleCallbackTcpRequest,
  GetMeTcpResponse,
  GetMeTcpRequest,
} from '@common/interfaces/tcp/auth';

import {
  ForgotPasswordTcpRequest,
  SendOtpBodyTcpRequest,
  ValidateVerificationCodeBodyTcpRequest,
} from '@common/interfaces/tcp/verification';
import { ResetPasswordTcpRequest } from '@common/interfaces/tcp/auth';

import { lastValueFrom, map, switchMap } from 'rxjs';
import {
  ForgotPasswordBodyDto,
  SendOtpBodyDto,
  ValidateVerificationCodeDto,
} from '@common/interfaces/gateway/verification';
import { TypeOfVerificationCode } from '@common/constants/enum/type-verification-code.enum';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer/authorizer-response.interface';
import { UserData } from '@common/decorators/user-data.decorator';
import { Authorization } from '@common/decorators/authorizer.decorator';

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

  @Post('re-send-link-forgot-password')
  @ApiOkResponse({ type: ResponseDto<{ message: string }> })
  @ApiOperation({ summary: 'Resend link forgot password' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async reSendLinkForgotPassword(
    @Body() body: ForgotPasswordBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.mailClient
      .send<{ message: string }, ForgotPasswordTcpRequest>(
        TCP_REQUEST_MESSAGE.MAIL.RESEND_LINK_FORGOT_PASSWORD,
        {
          data: { ...body, userAgent, ip },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('send-link-reset-password')
  @ApiOkResponse({ type: ResponseDto<{ message: string }> })
  @ApiOperation({ summary: 'Send link reset password' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async sendLinkResetPassword(
    @Body() body: ForgotPasswordBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.mailClient
      .send<{ message: string }, ForgotPasswordTcpRequest>(
        TCP_REQUEST_MESSAGE.MAIL.SEND_LINK_FORGOT_PASSWORD,
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
      .pipe(
        switchMap((authResult) => {
          return this.authClient
            .send(TCP_REQUEST_MESSAGE.AUTH.ACTIVE_USER, {
              data: {
                email: body.email,
                ip,
                userAgent,
              },
              processId,
            })
            .pipe(map(() => new ResponseDto(authResult)));
        })
      );
  }

  @Get('google/authorization-url')
  @ApiOkResponse({ type: ResponseDto<GetOAuthAuthorizationUrlResponseDto> })
  @ApiOperation({ summary: 'Get Google Authorization URL' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async getAuthorizationUrl(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.authClient
      .send<GoogleOAuthUrlTcpResponse, GoogleAuthUrlTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.GET_AUTHORIZATION_URL,
        {
          data: {
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth Callback' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Authorization code from Google',
  })
  @ApiQuery({
    name: 'state',
    required: true,
    description: 'State parameter for security',
  })
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Res() res: Response
  ) {
    const clientRedirectUri = 'http://localhost:3000/auth/google/callback';

    try {
      const result = await lastValueFrom(
        this.authClient.send<LoginTcpResponse, GoogleCallbackTcpRequest>(
          TCP_REQUEST_MESSAGE.AUTH.GOOGLE_CALLBACK,
          {
            data: {
              code,
              state,
              userAgent,
              ip,
            },
            processId: processId,
          }
        )
      );

      const { accessToken, refreshToken } = result.data;
      return res.redirect(
        `${clientRedirectUri}?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.redirect(
        `${clientRedirectUri}?error=${encodeURIComponent(message)}`
      );
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({ type: ResponseDto<string> })
  async resetPassword(
    @Body() body: ResetPasswordBodyDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string
  ) {
    return this.mailClient
      .send<{ message: string }, ValidateVerificationCodeBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.MAIL.VALIDATE_OTP,
        {
          data: {
            email: body.email,
            code: body.code,
            type: TypeOfVerificationCode.PASSWORD_RESET,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(
        switchMap((authResult) => {
          return this.authClient
            .send<{ message: string }, ResetPasswordTcpRequest>(
              TCP_REQUEST_MESSAGE.AUTH.RESET_PASSWORD,
              {
                data: {
                  ...body,
                  ip,
                  userAgent,
                },
                processId,
              }
            )
            .pipe(map(() => new ResponseDto(authResult)));
        })
      );
  }

  @Get('me')
  @ApiOkResponse({ type: ResponseDto<GetMeResponseDto> })
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  @Authorization({ secured: true })
  async getMe(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @UserData() userData: AuthorizedMetadata
  ) {
    return this.authClient
      .send<GetMeTcpResponse, GetMeTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.GET_ME,
        {
          data: {
            userId: userData.userId,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get('profile/:id')
  @ApiOkResponse({ type: ResponseDto<GetMeResponseDto> })
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  @Authorization({ secured: true })
  async getProfile(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Param('id') id: string
  ) {
    return this.authClient
      .send<GetMeTcpResponse, GetMeTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.GET_ME,
        {
          data: {
            userId: Number(id),
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
}
