import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTH_SERVICE)]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule {}
