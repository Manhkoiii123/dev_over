import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { AuthService } from '../services/auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParam } from '@common/decorators/request-param.decorator';
import {
  RegisterBodyTcpRequest,
  AuthTcpResponse,
} from '@common/interfaces/tcp/auth';
import { Response } from '@common/interfaces/tcp/common/response.interface';

@Controller('auth')
@UseInterceptors(TcpLoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern(TCP_REQUEST_MESSAGE.AUTH.REGISTER)
  async createProduct(
    @RequestParam() body: RegisterBodyTcpRequest
  ): Promise<Response<AuthTcpResponse>> {
    const result = (await this.authService.register(body)) as AuthTcpResponse;
    return Response.success<AuthTcpResponse>(result);
  }
}
