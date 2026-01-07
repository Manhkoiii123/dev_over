import { Module } from '@nestjs/common';
import { PrismaClient } from '../../../../generator/client';
import { PrismaModule } from '@common/database/prisma';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { AnswerController } from './controllers/answer.controller';
import { AnswerRepository } from './repositories/answer.repository';
import { AnswerService } from './services/answer.service';

@Module({
  controllers: [AnswerController],
  providers: [AnswerRepository, AnswerService],
  exports: [],
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClient,
    }),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTH_SERVICE)]),
  ],
})
export class AnswerModule {}
