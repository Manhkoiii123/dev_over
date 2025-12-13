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

import { map } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TCP_SERVICES.AUTH_SERVICE)
    private readonly authClient: TcpClient
  ) {}

  @Post('register')
  @ApiOkResponse({ type: ResponseDto<AuthResponseDto> })
  @ApiOperation({ summary: 'Register' })
  async register(
    @Body() body: RegisterBodyDto,
    @ProcessId() processId: string
  ) {
    return this.authClient
      .send<AuthTcpResponse, RegisterBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.AUTH.REGISTER,
        {
          data: body,
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
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
}
