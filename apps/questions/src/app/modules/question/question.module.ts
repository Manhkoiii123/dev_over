import { Module } from '@nestjs/common';
import { PrismaClient } from '../../../../generator/client';
import { PrismaModule } from '@common/database/prisma';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { QuestionRepository } from './repositories/question.repository';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [],
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClient,
    }),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTH_SERVICE)]),
  ],
})
export class QuestionModule {}
