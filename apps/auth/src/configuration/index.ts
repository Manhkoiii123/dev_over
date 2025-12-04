import { BaseConfiguration } from '@common/configuration/base.config';
import { AppConfiguration } from '@common/configuration/app.config';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TcpConfiguration } from '@common/configuration/tcp.config';
import { PrismaConfiguration } from '@common/configuration/prisma.config';
class Configuration extends BaseConfiguration {
  @ValidateNested()
  @Type(() => AppConfiguration)
  APP_CONFIG = new AppConfiguration();

  @ValidateNested()
  @Type(() => AppConfiguration)
  TCP_SERV = new TcpConfiguration();

  @ValidateNested()
  @Type(() => PrismaConfiguration)
  PRISMA_CONFIG = new PrismaConfiguration({
    HOST: process.env['AUTH_DB_HOST'] || 'localhost',
    PORT: Number(process.env['AUTH_DB_PORT']) || 5434,
    USERNAME: process.env['AUTH_DB_USERNAME'] || 'postgres',
    PASSWORD: process.env['AUTH_DB_PASSWORD'] || 'example',
    DATABASE: process.env['AUTH_DB_DATABASE'] || 'overflow-app',
    SCHEMA: process.env['AUTH_DB_SCHEMA'] || 'auth',
  });
}

export const CONFIGURATION = new Configuration();

export type TConfiguration = typeof CONFIGURATION;

CONFIGURATION.validate();
