import { PrismaService } from '@common/database/prisma';
import { Injectable } from '@nestjs/common';
import { PrismaClient as PrismaQuestionClient } from '../../../../../../questions/generator/client';
import { CreateQuestionBodyTcpRequest } from '@common/interfaces/tcp/question';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService<PrismaQuestionClient>) {}

  async createQuestion(data: CreateQuestionBodyTcpRequest, userId: number) {
    const { title, content, tags } = data;

    return this.prisma.client.$transaction(async (tx) => {
      await tx.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId },
      });

      const question = await tx.question.create({
        data: {
          title,
          content,
          author: { connect: { id: userId } },
        },
      });

      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {
              questions: { increment: 1 },
            },
            create: {
              name: tagName,
              questions: 1,
            },
          });

          await tx.tagQuestion.create({
            data: {
              tag: { connect: { id: tag.id } },
              question: { connect: { id: question.id } },
            },
          });
        }
      }

      return question;
    });
  }

  async getQuestionById(questionId: string) {
    const res = await this.prisma.client.question.findUnique({
      where: { id: questionId },
      include: {
        tagQuestions: {
          include: {
            tag: true,
          },
        },
      },
    });

    const format = {
      id: res.id,
      title: res.title,
      content: res.content,
      upvotes: res.upvotes,
      downvotes: res.downvotes,
      viewsCount: res.viewsCount,
      authorId: res.authorId,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      tags: res.tagQuestions.map((tagQuestion) => ({
        name: tagQuestion.tag.name,
      })),
    };

    return format;
  }
}
