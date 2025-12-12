import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '@common/database/prisma';
import { PrismaClient as PrismaClientAuth } from '../../../../../auth/generator/client';

@Module({
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClientAuth,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AuthModule {}
