import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AnswerService } from '../services/answer.service';

@Controller('answers')
@UseInterceptors(TcpLoggingInterceptor)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}
}
