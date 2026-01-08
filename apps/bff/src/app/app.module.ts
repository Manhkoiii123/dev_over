import { MiddlewareConsumer, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { exceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UserGuard } from '@common/guard/user.guard';
import { QuestionModule } from './modules/questions/question.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AnswerModule } from './modules/answers/answer.module';

// Register AUTH_SERVICE globally for UserGuard
const GlobalTcpClients = ClientsModule.registerAsync([
  TcpProvider(TCP_SERVICES.AUTH_SERVICE),
]);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    GlobalTcpClients,
    AuthModule,
    QuestionModule,
    AnswerModule,
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
