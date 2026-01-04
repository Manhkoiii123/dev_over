import { Injectable } from '@nestjs/common';
import { CreateQuestionBodyTcpRequest } from '@common/interfaces/tcp/question';
import { QuestionRepository } from '../repositories/question.repository';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async createQuestion(data: CreateQuestionBodyTcpRequest) {
    const { userId } = data;
    return await this.questionRepository.createQuestion(data, userId);
  }
}
