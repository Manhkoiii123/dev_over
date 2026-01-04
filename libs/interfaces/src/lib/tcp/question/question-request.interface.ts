import { CreateQuestionDto } from '../../gateway/question';

export type CreateQuestionBodyTcpRequest = CreateQuestionDto & {
  userAgent: string;
  ip: string;
  userId: number;
};
