import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma';
import { PrismaClient as PrismaClientAuth } from '../../../../../generator/client';
import { VerificationCodeDto } from '@common/interfaces/gateway/verification';
import { TypeOfVerificationCode } from '@common/constants/enum/type-verification-code.enum';

@Injectable()
export class MailRepository {
  constructor(private readonly prisma: PrismaService<PrismaClientAuth>) {}
  async createVerificationCode(payload: VerificationCodeDto) {
    return await this.prisma.client.verificationCode.upsert({
      where: {
        email_type_code: {
          email: payload.email,
          type: payload.type,
          code: payload.code,
        },
      },
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt,
      },
      create: payload,
    });
  }

  async findUniqueVerificationCode(data: {
    email_type_code: {
      email: string;
      code: string;
      type: TypeOfVerificationCode;
    };
  }) {
    return await this.prisma.client.verificationCode.findUnique({
      where: data,
    });
  }

  async existsWithEmail(email: string) {
    return this.prisma.client.verificationCode.findFirst({
      where: {
        email,
      },
    });
  }

  async deleteVerificationCode(data: {
    email_type: {
      email: string;
      type: TypeOfVerificationCode;
    };
  }) {
    return await this.prisma.client.verificationCode.delete({
      where: {
        email_type: {
          email: data.email_type.email,
          type: data.email_type.type,
        },
      },
    });
  }
}
