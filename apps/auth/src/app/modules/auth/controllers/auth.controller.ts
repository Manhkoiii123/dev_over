import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { AuthService } from '../services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParam } from '@common/decorators/request-param.decorator';
import {
  RegisterBodyTcpRequest,
  AuthTcpResponse,
  LoginBodyTcpRequest,
  LoginTcpResponse,
  RefreshTokenBodyTcpRequest,
  RefreshTokenTcpResponse,
} from '@common/interfaces/tcp/auth';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller('auth')
@UseInterceptors(TcpLoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.REGISTER)
  async register(
    @RequestParam() body: RegisterBodyTcpRequest
  ): Promise<Response<AuthTcpResponse>> {
    const result = (await this.authService.register(body)) as AuthTcpResponse;
    return Response.success<AuthTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.LOGIN)
  async login(
    @RequestParam() body: LoginBodyTcpRequest
  ): Promise<Response<LoginTcpResponse>> {
    const result = (await this.authService.login(body)) as LoginTcpResponse;
    return Response.success<LoginTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.REFRESH_TOKEN)
  async refreshToken(
    @RequestParam() body: RefreshTokenBodyTcpRequest
  ): Promise<Response<RefreshTokenTcpResponse>> {
    const result = (await this.authService.refreshToken(
      body
    )) as RefreshTokenTcpResponse;
    return Response.success<RefreshTokenTcpResponse>(result);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.LOGOUT)
  async logout(
    @RequestParam() body: RefreshTokenBodyTcpRequest
  ): Promise<Response<string>> {
    const result = await this.authService.logout(body.refreshToken);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
