import { Injectable } from '@nestjs/common';
import { AnswerRepository } from '../repositories/answer.repository';

@Injectable()
export class AnswerService {
  constructor(private readonly answerRepository: AnswerRepository) {}
}
