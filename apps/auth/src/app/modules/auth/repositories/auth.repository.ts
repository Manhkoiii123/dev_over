import { PrismaService } from '@common/database/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClient as PrismaClientAuth } from '../../../../../../auth/generator/client';
import { RegisterBodyTcpRequest } from '@common/interfaces/tcp/auth';
import { CreateDeviceBodyDto } from '@common/interfaces/gateway/device';
import { USER_STATUS } from '@common/constants/enum/user-status.enum';
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

  async existsWithEmail(email: string) {
    return this.prisma.client.user.findFirst({
      where: {
        email,
      },
    });
  }

  async getMe(userId: string) {
    return this.prisma.client.user.findUnique({
      where: { id: Number(userId) },
      omit: { password: true },
    });
  }
  async findUserByEmail(email: string) {
    return this.prisma.client.user.findUnique({
      where: { email },
      omit: { password: true },
    });
  }

  async existsWithEmailOrUsername(email: string, username: string) {
    return this.prisma.client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
  }

  createDevice(data: CreateDeviceBodyDto) {
    return this.prisma.client.device.create({ data });
  }

  createRefreshToken(data: {
    token: string;
    userId: number;
    expiresAt: Date;
    deviceId: number;
  }) {
    return this.prisma.client.refreshToken.create({ data });
  }

  async findRefreshToken(data: { token: string }) {
    return await this.prisma.client.refreshToken.findFirst({
      where: {
        token: data.token,
      },
      include: {
        user: true,
      },
    });
  }

  async updateDevice(deviceId: number, data: Partial<CreateDeviceBodyDto>) {
    return this.prisma.client.device.update({
      where: { id: deviceId },
      data,
    });
  }

  async deleteRefreshToken(token: string) {
    return await this.prisma.client.refreshToken.delete({ where: { token } });
  }

  async activeUser(email: string) {
    return this.prisma.client.user.updateMany({
      where: { email },
      data: { status: USER_STATUS.ACTIVE },
    });
  }

  async updateUser(userId: number, data: Partial<RegisterBodyTcpRequest>) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data,
    });
  }
}
