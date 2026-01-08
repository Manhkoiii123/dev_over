import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AnswerService } from '../services/answer.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateAnswerBodyTcpRequest } from '@common/interfaces/tcp/answer';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller('answers')
@UseInterceptors(TcpLoggingInterceptor)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.ANSWER.CREATE)
  async createAnswer(
    @RequestParam() body: CreateAnswerBodyTcpRequest
  ): Promise<Response<string>> {
    await this.answerService.createAnswer(body);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }
}
