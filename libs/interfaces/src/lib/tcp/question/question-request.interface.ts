import { CreateQuestionDto } from '../../gateway/question';

export type CreateQuestionBodyTcpRequest = CreateQuestionDto & {
  userAgent: string;
  ip: string;
  userId: number;
};

export type GetQuestionBodyTcpRequest = {
  questionId: string;
  userAgent: string;
  ip: string;
};
