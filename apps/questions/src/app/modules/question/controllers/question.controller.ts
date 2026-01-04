import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { QuestionService } from '../services/question.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateQuestionBodyTcpRequest } from '@common/interfaces/tcp/question';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';

@Controller('question')
@UseInterceptors(TcpLoggingInterceptor)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.QUESTION.CREATE)
  async createQuestion(
    @RequestParam() body: CreateQuestionBodyTcpRequest
  ): Promise<Response<string>> {
    await this.questionService.createQuestion(body);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }
}
