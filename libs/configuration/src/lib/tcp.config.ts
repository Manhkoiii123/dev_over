import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientsProviderAsyncOptions,
  TcpClientOptions,
  Transport,
} from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
export enum TCP_SERVICES {
  AUTH_SERVICE = 'TCP_AUTH_SERVICE',
  MAIL_SERVICE = 'TCP_MAIL_SERVICE',
  QUESTION_SERVICE = 'TCP_QUESTION_SERVICE',
}
export class TcpConfiguration {
  @IsNotEmpty()
  @IsObject()
  TCP_AUTH_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_MAIL_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_QUESTION_SERVICE: TcpClientOptions;

  constructor() {
    Object.entries(TCP_SERVICES).forEach(([key, serviceName]) => {
      const host = process.env[`${key}_HOST`] || 'localhost';
      const port = Number(process.env[`${serviceName}_PORT`]);

      this[serviceName] = TcpConfiguration.setValue(port, host);
    });
  }

  static setValue(port: number, host: string): TcpClientOptions {
    return {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    };
  }
}

export function TcpProvider(
  serviceName: keyof TcpConfiguration
): ClientsProviderAsyncOptions {
  return {
    name: serviceName,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return configService.get(`TCP_SERV.${serviceName}`) as TcpClientOptions;
    },
  };
}
