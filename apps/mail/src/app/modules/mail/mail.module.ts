import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/database/prisma';
import { PrismaClient } from '../../../../generator/client';
import { MailController } from './controllers/mail.controller';
import { MailRepository } from './repositories/mail.repository';
import { MailService } from './services/mail.service';
import { EmailService } from '../../shared/services/email.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClient,
    }),
  ],
  controllers: [MailController],
  providers: [MailRepository, MailService, EmailService],
})
export class MailModule {}
