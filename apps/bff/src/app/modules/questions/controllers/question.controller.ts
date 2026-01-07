import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import {
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Ip,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  AnalysisQuestionDto,
  CreateQuestionDto,
  DetailQuestionResponseDto,
  ListQuestionsDto,
  ListAnswersDto,
  ListQuestionsResponseDto,
  QuestionAnswersResponseDto,
  QuestionResponseDto,
  VoteDownvoteBodyDto,
} from '@common/interfaces/gateway/question';
import { ProcessId } from '@common/decorators/processId.decorator';
import {
  AnalysisQuestionTcpResponse,
  CreateQuestionBodyTcpRequest,
  DetailQuestionTcpResponse,
  GetQuestionBodyTcpRequest,
  ListQuestionsBodyTcpRequest,
  ListQuestionsTcpResponse,
  QuestionAnswersTcpResponse,
  QuestionTcpResponse,
  ListAnswersByQuestionIdBodyTcpRequest,
  VoteUpvoteBodyTcpRequest,
} from '@common/interfaces/tcp/question';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer/authorizer-response.interface';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(
    @Inject(TCP_SERVICES.QUESTION_SERVICE)
    private readonly questionClient: TcpClient
  ) {}

  @Post('')
  @Authorization({ secured: true })
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Create question' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async createQuestion(
    @Body() body: CreateQuestionDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @UserData() userData: AuthorizedMetadata
  ) {
    return this.questionClient
      .send<string, CreateQuestionBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.CREATE,
        {
          data: {
            ...body,
            userAgent,
            ip,
            userId: userData.userId,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Get('')
  @ApiOkResponse({ type: ResponseDto<ListQuestionsResponseDto> })
  @ApiOperation({ summary: 'Get list of questions' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async getList(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Query() query: ListQuestionsDto
  ) {
    return this.questionClient
      .send<ListQuestionsTcpResponse, ListQuestionsBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.GET_LIST,
        {
          data: {
            query: {
              ...query,
              userAgent,
              ip,
            },
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseDto<DetailQuestionResponseDto> })
  @ApiOperation({ summary: 'Get detail question' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async getById(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Param('id') id: string
  ) {
    return this.questionClient
      .send<DetailQuestionTcpResponse, GetQuestionBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.GET_BY_ID,
        {
          data: {
            questionId: id,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Get('/analytics/:id')
  @ApiOkResponse({ type: ResponseDto<AnalysisQuestionDto> })
  @ApiOperation({ summary: 'Get analytics question' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async getAnalytics(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Param('id') id: string
  ) {
    return this.questionClient
      .send<AnalysisQuestionTcpResponse, GetQuestionBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.GET_ANALYTICS,
        {
          data: {
            questionId: id,
            userAgent,
            ip,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
  @Get('/answers/:id')
  @ApiOkResponse({ type: ResponseDto<QuestionAnswersResponseDto> })
  @ApiOperation({ summary: 'Get answers question' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  async getAnswersByQuestionId(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Param('id') id: string,
    @Query() query: ListAnswersDto
  ) {
    return this.questionClient
      .send<QuestionAnswersTcpResponse, ListAnswersByQuestionIdBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.GET_ANSWERS_BY_QUESTION_ID,
        {
          data: {
            questionId: id,
            query: {
              ...query,
              userAgent,
              ip,
            },
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post('/vote-downvote/:id')
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Vote or downvote question or answer' })
  @ApiHeader({
    name: 'user-agent',
    description: 'User agent của client (trình duyệt/ứng dụng)',
    required: true,
  })
  @Authorization({ secured: true })
  async voteDownvote(
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @Param('id') id: string,
    @UserData() userData: AuthorizedMetadata,
    @Body() body: VoteDownvoteBodyDto
  ) {
    return this.questionClient
      .send<string, VoteUpvoteBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.QUESTION.VOTE_OR_DOWNVOTE_QUESTION,
        {
          data: {
            id: id,
            userAgent,
            ip,
            isUpvote: body.isUpvote,
            userId: userData.userId.toString(),
            type: body.type,
          },
          processId: processId,
        }
      )
      .pipe(map((data) => new ResponseDto(data)));
  }
}
