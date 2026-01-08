import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Headers, Inject, Ip, Post } from '@nestjs/common';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAnswerRequestDto } from '@common/interfaces/gateway/answer';
import { ProcessId } from '@common/decorators/processId.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { AuthorizedMetadata } from '@common/interfaces/tcp/authorizer/authorizer-response.interface';
import { CreateAnswerBodyTcpRequest } from '@common/interfaces/tcp/answer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';

@ApiTags('answers')
@Controller('questions')
export class AnswerController {
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
  createAnswer(
    @Body() body: CreateAnswerRequestDto,
    @ProcessId() processId: string,
    @Headers('user-agent') userAgent: string,
    @Ip() ip: string,
    @UserData() userData: AuthorizedMetadata
  ) {
    return this.questionClient
      .send<string, CreateAnswerBodyTcpRequest>(
        TCP_REQUEST_MESSAGE.ANSWER.CREATE,
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
