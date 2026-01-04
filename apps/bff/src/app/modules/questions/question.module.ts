import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.QUESTION_SERVICE)]),
  ],
  controllers: [QuestionController],
  providers: [],
  exports: [],
})
export class QuestionModule {}
