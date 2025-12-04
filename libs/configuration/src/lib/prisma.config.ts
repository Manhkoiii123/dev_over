import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

export class PrismaConfiguration {
  @IsString()
  @IsNotEmpty()
  HOST: string;

  @IsNumber()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  USERNAME: string;

  @IsString()
  @IsNotEmpty()
  PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE: string;

  @IsString()
  @IsNotEmpty()
  SCHEMA: string;

  constructor(data?: Partial<PrismaConfiguration>) {
    this.HOST = data?.HOST || process.env['PRISMA_HOST'] || 'localhost';
    this.PORT = data?.PORT || Number(process.env['PRISMA_PORT']) || 5434;
    this.USERNAME =
      data?.USERNAME || process.env['PRISMA_USERNAME'] || 'postgres';
    this.PASSWORD =
      data?.PASSWORD || process.env['PRISMA_PASSWORD'] || 'example';
    this.DATABASE =
      data?.DATABASE || process.env['PRISMA_DATABASE'] || 'overflow-app';
    this.SCHEMA = data?.SCHEMA || process.env['PRISMA_SCHEMA'] || 'public';
  }
}

export const PrismaProvider = PrismaModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const HOST = configService.get<string>('PRISMA_CONFIG.HOST');
    const PORT = configService.get<number>('PRISMA_CONFIG.PORT');
    const USERNAME = configService.get<string>('PRISMA_CONFIG.USERNAME');
    const PASSWORD = configService.get<string>('PRISMA_CONFIG.PASSWORD');
    const DATABASE = configService.get<string>('PRISMA_CONFIG.DATABASE');
    const SCHEMA = configService.get<string>('PRISMA_CONFIG.SCHEMA');

    const datasourceUrl = `postgresql://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}?schema=${SCHEMA}`;

    return {
      prismaOptions: {
        datasourceUrl,
      },
      explicitConnect: true,
    };
  },
});
