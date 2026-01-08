import { Injectable } from '@nestjs/common';
import { AnswerRepository } from '../repositories/answer.repository';
import { CreateAnswerBodyTcpRequest } from '@common/interfaces/tcp/answer';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) {}

  async createAnswer(data: CreateAnswerBodyTcpRequest) {
    const { userId } = data;
    return this.answerRepository.createAnswer(data, userId);
  }
}
