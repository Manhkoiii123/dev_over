import {
  Module,
  DynamicModule,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class PrismaService<T> implements OnModuleInit {
  constructor(private readonly prisma: T) {}

  get client(): T {
    return this.prisma;
  }

  async onModuleInit() {
    // @ts-ignore: prisma is dynamic
    await this.prisma.$connect();
  }
}

@Module({})
export class PrismaModule {
  static forRoot<T>(options: {
    databaseUrl: string;
    client: new (...args: any[]) => T;
  }): DynamicModule {
    return {
      module: PrismaModule,
      providers: [
        {
          provide: 'PRISMA_INSTANCE',
          useFactory: () => {
            return new options.client({
              datasources: {
                db: {
                  url: options.databaseUrl,
                },
              },
            }) as T;
          },
        },
        {
          provide: PrismaService,
          useFactory: (instance: T) => {
            return new PrismaService<T>(instance);
          },
          inject: ['PRISMA_INSTANCE'],
        },
      ],
      exports: [PrismaService],
    };
  }
}
