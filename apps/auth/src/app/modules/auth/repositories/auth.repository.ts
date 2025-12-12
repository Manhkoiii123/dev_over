import { PrismaService } from '@common/database/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClient as PrismaClientAuth } from '../../../../../../auth/generator/client';
import { RegisterBodyTcpRequest } from '@common/interfaces/tcp/auth';
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService<PrismaClientAuth>) {}
  async createUser(data: RegisterBodyTcpRequest) {
    return this.prisma.client.user.create({
      data: {
        email: data.email,
        username: data.username,
        password: data.password,
      },
      omit: { password: true },
    });
  }

  async exists(email: string, username: string) {
    return this.prisma.client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }
}
