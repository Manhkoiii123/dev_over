import { Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from '@common/database/prisma';
// import { PrismaClient as PrismaClientAuth } from '../../../auth/generator/client';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),

    // PrismaModule.forRoot({
    //   databaseUrl: process.env.DATABASE_URL!,
    //   client: PrismaClientAuth,
    // }),
    AuthModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
