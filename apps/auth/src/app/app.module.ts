import { Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    AuthModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
