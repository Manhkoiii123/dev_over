import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { exceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UserGuard } from '@common/guard/user.guard';
import { QuestionModule } from './modules/questions/question.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    AuthModule,
    QuestionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: exceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
