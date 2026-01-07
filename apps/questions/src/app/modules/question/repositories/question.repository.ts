import { PrismaService } from '@common/database/prisma';
import { Inject, Injectable } from '@nestjs/common';
import {
  PrismaClient as PrismaQuestionClient,
  Prisma,
} from '../../../../../../questions/generator/client';
import { CreateQuestionBodyTcpRequest } from '@common/interfaces/tcp/question';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { GetMeTcpResponse, GetMeTcpRequest } from '@common/interfaces/tcp/auth';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { first, firstValueFrom, map } from 'rxjs';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import {
  ListQuestionsDto,
  QuestionFilter,
} from '@common/interfaces/gateway/question';
@Injectable()
export class QuestionRepository {
  constructor(
    private readonly prisma: PrismaService<PrismaQuestionClient>,
    @Inject(TCP_SERVICES.AUTH_SERVICE) private readonly authClient: TcpClient
  ) {}

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

  async getQuestionById(questionId: string, processId: string) {
    const res = await this.prisma.client.question.findUnique({
      where: { id: questionId },
      include: {
        tagQuestions: {
          include: {
            tag: true,
          },
        },
        answers: {
          include: {
            author: true,
          },
        },
      },
    });
    const user = await firstValueFrom(
      this.authClient
        .send<GetMeTcpResponse, { userId: number }>(
          TCP_REQUEST_MESSAGE.AUTH.GET_ME,
          {
            data: {
              userId: Number(res.authorId),
            },
            processId: processId,
          }
        )
        .pipe(map((data) => new ResponseDto(data)))
    );
    const dataUserAnswers = res.answers.map((answer) => answer.authorId);

    const userAnswers = dataUserAnswers.map(async (userId) => {
      const res = await firstValueFrom(
        this.authClient
          .send<GetMeTcpResponse, { userId: number }>(
            TCP_REQUEST_MESSAGE.AUTH.GET_ME,
            {
              data: {
                userId: userId,
              },
              processId: processId,
            }
          )
          .pipe(map((data) => new ResponseDto(data)))
      );

      return res.data;
    });
    const userAnswersTransform = (await Promise.all(userAnswers)).map(
      (user) => {
        return {
          id: user.id,
          name: user.username,
          avatar: user.avatar,
          email: user.email,
        };
      }
    );

    const formatAnswers = res.answers.map((answer) => {
      return {
        id: answer.id,
        content: answer.content,
        authorId: answer.authorId,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        author: userAnswersTransform.find(
          (user) => user.id === answer.authorId
        ),
      };
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
      author: user.data,
      answers: formatAnswers,
    };

    return format;
  }

  async getList(query: ListQuestionsDto, processId: string) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.QuestionWhereInput = {
      ...(query.search
        ? {
            OR: [
              {
                title: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                content: {
                  contains: query.search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
      ...(query.filter === QuestionFilter.UNANSWERED
        ? {
            answers: {
              none: {},
            },
          }
        : {}),
    };

    let orderBy:
      | Prisma.QuestionOrderByWithRelationInput
      | Prisma.QuestionOrderByWithRelationInput[];
    switch (query.filter) {
      case QuestionFilter.RECOMMENDED:
        orderBy = [
          { upvotes: 'desc' },
          { viewsCount: 'desc' },
          { createdAt: 'desc' },
        ];
        break;
      case QuestionFilter.FREQUENT:
        orderBy = { viewsCount: 'desc' };
        break;
      case QuestionFilter.UNANSWERED:
        orderBy = { createdAt: 'desc' };
        break;
      case QuestionFilter.NEWEST:
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await this.prisma.client.$transaction([
      this.prisma.client.question.findMany({
        skip,
        take: limit,
        orderBy,
        where,
        include: {
          tagQuestions: {
            include: {
              tag: true,
            },
          },
          bookmarks: true,
          answers: {
            select: {
              id: true,
            },
          },
        },
      }),
      this.prisma.client.question.count({
        where,
      }),
    ]);

    const authorIds = [...new Set(items.map((item) => item.authorId))];
    const authors = await Promise.all(
      authorIds.map(async (authorId) => {
        const user = await firstValueFrom(
          this.authClient
            .send<GetMeTcpResponse, { userId: number }>(
              TCP_REQUEST_MESSAGE.AUTH.GET_ME,
              {
                data: { userId: authorId },
                processId: processId,
              }
            )
            .pipe(map((data) => new ResponseDto(data)))
        );
        return { authorId, user: user.data };
      })
    );

    const authorMap = new Map(authors.map((a) => [a.authorId, a.user]));

    const data = items.map((question) => ({
      id: question.id,
      title: question.title,
      content: question.content,
      upvotes: question.upvotes,
      downvotes: question.downvotes,
      viewsCount: question.viewsCount,
      authorId: question.authorId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      tags: question.tagQuestions.map((tq) => ({ name: tq.tag.name })),
      author: authorMap.get(question.authorId),
      answersCount: question.answers.length,
      bookmarksCount: question.bookmarks.length,
    }));

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
