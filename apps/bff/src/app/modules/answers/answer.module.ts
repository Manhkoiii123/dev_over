import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AnswerController } from './controllers/answer.controller';

const TcpClients = ClientsModule.registerAsync([
  TcpProvider(TCP_SERVICES.AUTH_SERVICE),
  TcpProvider(TCP_SERVICES.QUESTION_SERVICE),
]);

@Module({
  imports: [TcpClients],
  controllers: [AnswerController],
  providers: [],
  exports: [TcpClients],
})
export class AnswerModule {}
