import {
  CreateQuestionDto,
  ListQuestionsDto,
  ListAnswersDto,
  VoteDownvoteBodyDto,
} from '../../gateway/question';

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

export type ListAnswersByQuestionIdBodyTcpRequest = {
  questionId: string;
  query: ListAnswersDto & {
    userAgent: string;
    ip: string;
  };
};

export type VoteUpvoteBodyTcpRequest = VoteDownvoteBodyDto & {
  userAgent: string;
  ip: string;
  id: string;
  userId: number;
};

export type HadVotedSavedQuestionBodyTcpRequest = {
  questionId: string;
  userAgent: string;
  ip: string;
  userId: number;
};
