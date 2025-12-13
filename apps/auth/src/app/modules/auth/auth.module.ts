import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { PrismaModule } from '@common/database/prisma';
import { PrismaClient as PrismaClientAuth } from '../../../../../auth/generator/client';
import { HashingService } from '../../shared/service/hashing.service';
import { TokenService } from '../../shared/service/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule.forRoot({
      databaseUrl: process.env.DATABASE_URL!,
      client: PrismaClientAuth,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    HashingService,
    TokenService,
    JwtService,
  ],
})
export class AuthModule {}
