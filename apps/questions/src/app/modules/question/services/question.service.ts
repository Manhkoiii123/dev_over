import { Injectable } from '@nestjs/common';
import {
  CreateQuestionBodyTcpRequest,
  ListQuestionsBodyTcpRequest,
} from '@common/interfaces/tcp/question';
import { QuestionRepository } from '../repositories/question.repository';
import {
  ListQuestionsDto,
  ListAnswersDto,
} from '@common/interfaces/gateway/question';
import { ActionType } from '@common/constants/enum/vote.enum';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async createQuestion(data: CreateQuestionBodyTcpRequest) {
    const { userId } = data;
    return await this.questionRepository.createQuestion(data, userId);
  }

  async getQuestionById(questionId: string, processId: string) {
    return await this.questionRepository.getQuestionById(questionId, processId);
  }

  async getList(query: ListQuestionsDto, processId: string) {
    return await this.questionRepository.getList(query, processId);
  }

  async getAnalytics(questionId: string, processId: string) {
    return await this.questionRepository.getAnalytics(questionId, processId);
  }

  async getAnswersByQuestionId(
    questionId: string,
    query: ListAnswersDto,
    processId: string
  ) {
    return await this.questionRepository.getAnswersByQuestionId(
      questionId,
      query,
      processId
    );
  }

  async voteOrDownvoteQuestionAndAnswer(
    id: string,
    isUpvote: boolean,
    processId: string,
    userId: number,
    type: ActionType
  ) {
    return await this.questionRepository.voteOrDownvoteQuestionAndAnswer(
      id,
      isUpvote,
      processId,
      userId,
      type
    );
  }
}
