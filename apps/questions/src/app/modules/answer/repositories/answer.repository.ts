import { PrismaService } from '@common/database/prisma';
import { Inject, Injectable } from '@nestjs/common';
import {
  PrismaClient as PrismaQuestionClient,
  Prisma,
} from '../../../../../../questions/generator/client';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateAnswerBodyTcpRequest } from '@common/interfaces/tcp/answer';
@Injectable()
export class AnswerRepository {
  constructor(
    private readonly prisma: PrismaService<PrismaQuestionClient>,
    @Inject(TCP_SERVICES.AUTH_SERVICE) private readonly authClient: TcpClient
  ) {}

  async createAnswer(data: CreateAnswerBodyTcpRequest, userId: number) {
    const { content, questionId } = data;
    const question = await this.prisma.client.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new Error('Question not found');
    }

    await this.prisma.client.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId },
      });
      await tx.question.update({
        where: { id: questionId },
        data: {
          answersCount: { increment: 1 },
        },
      });

      await tx.answer.create({
        data: {
          content,
          author: { connect: { id: userId } },
          question: { connect: { id: questionId } },
        },
      });
    });
  }
}
