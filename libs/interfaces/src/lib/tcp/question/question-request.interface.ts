import { CreateQuestionDto, ListQuestionsDto } from '../../gateway/question';

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

export type ListQuestionsBodyTcpRequest = {
  query: ListQuestionsDto & {
    userAgent: string;
    ip: string;
  };
};
