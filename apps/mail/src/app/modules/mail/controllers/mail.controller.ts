import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { MailService } from '../services/mail.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { SendOtpBodyTcpRequest } from '@common/interfaces/tcp/auth';
import { ValidateVerificationCodeBodyTcpRequest } from '@common/interfaces/tcp/verification';

@Controller('mail')
@UseInterceptors(TcpLoggingInterceptor)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MAIL.SEND_OTP)
  async register(
    @RequestParam() body: SendOtpBodyTcpRequest
  ): Promise<Response<{ message: string }>> {
    const result = await this.mailService.sendOtp(body);
    return Response.success<{ message: string }>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.MAIL.VALIDATE_OTP)
  async verify(
    @RequestParam() body: ValidateVerificationCodeBodyTcpRequest
  ): Promise<Response<{ message: string }>> {
    const result = await this.mailService.validateVerificationCode(body);
    return Response.success<{ message: string }>(result);
  }
}
