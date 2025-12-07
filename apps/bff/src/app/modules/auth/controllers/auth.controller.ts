import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';

import {
  AuthResponseDto,
  RegisterBodyDto,
} from '@common/interfaces/gateway/auth';
import {
  AuthTcpResponse,
  RegisterBodyTcpRequest,
} from '@common/interfaces/tcp/auth';

import { map } from 'rxjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(TCP_SERVICES.AUTH_SERVICE)
    private readonly authClient: TcpClient
  ) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<AuthResponseDto> })
  @ApiOperation({ summary: 'Register' })
  async createProduct(
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
}
