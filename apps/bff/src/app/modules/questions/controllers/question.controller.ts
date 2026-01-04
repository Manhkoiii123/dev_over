import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Headers, Inject, Ip, Post } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateQuestionDto,
  QuestionResponseDto,
} from '@common/interfaces/gateway/question';
import { ProcessId } from '@common/decorators/processId.decorator';
import {
  CreateQuestionBodyTcpRequest,
  QuestionTcpResponse,
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
}
