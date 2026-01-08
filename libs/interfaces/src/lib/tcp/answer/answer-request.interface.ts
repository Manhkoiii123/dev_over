import { CreateAnswerRequestDto } from '../../gateway/answer';

export type CreateAnswerBodyTcpRequest = CreateAnswerRequestDto & {
  userAgent: string;
  ip: string;
  userId: number;
};
