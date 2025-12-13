import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTH_SERVICE)]),
  ],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
