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
import { GoogleService } from '../../../shared/service/google.service';

@Controller('auth')
@UseInterceptors(TcpLoggingInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService
  ) {}

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
    await this.authService.logout(body.refreshToken);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.ACTIVE_USER)
  async activeUser(
    @RequestParam() body: { email: string }
  ): Promise<Response<string>> {
    await this.authService.activeUser(body.email);
    return Response.success<string>(HTTP_MESSAGE.OK);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.GET_AUTHORIZATION_URL)
  async getAuthorizationUrl(
    @RequestParam() body: { userAgent: string; ip: string }
  ): Promise<Response<string>> {
    const result = await this.googleService.getAuthorizationUrl(body);
    return Response.success<string>(result.url);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.GOOGLE_CALLBACK)
  async googleCallback(
    @RequestParam()
    body: {
      code: string;
      state: string;
      userAgent: string;
      ip: string;
    }
  ): Promise<Response<LoginTcpResponse>> {
    console.log('🚀 ~ AuthController ~ googleCallback ~ code:', body.code);
    const result = await this.googleService.googleCallback({
      code: body.code,
      state: body.state,
    });
    return Response.success<LoginTcpResponse>(result as LoginTcpResponse);
  }
}
