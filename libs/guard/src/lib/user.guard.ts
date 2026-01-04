import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constants/common.constant';
import { getAccessToken, setUserData } from '@common/utils/request.utils';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer/authorizer-response.interface';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTH_SERVICE)
    private readonly authorizerClient: TcpClient
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(
      MetadataKeys.SECURED,
      context.getHandler()
    );
    const req = context.switchToHttp().getRequest();
    if (!authOptions?.secured) {
      return true;
    }
    return this.verifyToken(req);
  }

  private async verifyToken(request: any): Promise<boolean> {
    try {
      const token = getAccessToken(request);

      const processId = request[MetadataKeys.PROCESS_ID];

      const res = await this.verifyUserToken(token, processId);

      if (!res?.valid) {
        throw new UnauthorizedException("Token doesn't exist");
      }
      setUserData(request, res);
      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException("Token doesn't exist");
    }
  }

  private async verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(
          TCP_REQUEST_MESSAGE.AUTH.VERIFY_USER_TOKEN,
          {
            data: token,
            processId,
          }
        )
        .pipe(map((data) => data.data))
    );
  }
}
