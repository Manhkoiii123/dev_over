import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { QuestionService } from '../services/question.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import {
  AnalysisQuestionTcpResponse,
  CreateQuestionBodyTcpRequest,
  DetailQuestionTcpResponse,
  ListQuestionsBodyTcpRequest,
  ListQuestionsTcpResponse,
} from '@common/interfaces/tcp/question';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';

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
  @MessagePattern(TCP_REQUEST_MESSAGE.QUESTION.GET_BY_ID)
  async getQuestionById(
    @RequestParam() params: { questionId: string },
    @ProcessId() processId: string
  ): Promise<Response<DetailQuestionTcpResponse>> {
    const res = await this.questionService.getQuestionById(
      params.questionId,
      processId
    );
    return Response.success<DetailQuestionTcpResponse>(res);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.QUESTION.GET_LIST)
  async getList(
    @RequestParam() params: ListQuestionsBodyTcpRequest,
    @ProcessId() processId: string
  ): Promise<Response<ListQuestionsTcpResponse>> {
    const res = await this.questionService.getList(params.query, processId);
    return Response.success<ListQuestionsTcpResponse>(res);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.QUESTION.GET_ANALYTICS)
  async getAnalytics(
    @RequestParam() params: { questionId: string },
    @ProcessId() processId: string
  ): Promise<Response<AnalysisQuestionTcpResponse>> {
    const res = await this.questionService.getAnalytics(
      params.questionId,
      processId
    );
    return Response.success<AnalysisQuestionTcpResponse>(res);
  }
}
