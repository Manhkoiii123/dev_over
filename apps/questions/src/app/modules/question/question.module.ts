import { Module } from '@nestjs/common';
import { PrismaClient } from '../../../../generator/client';
import { PrismaModule } from '@common/database/prisma';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';
import { QuestionRepository } from './repositories/question.repository';
@Module({
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [],
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClient,
    }),
  ],
})
export class QuestionModule {}
