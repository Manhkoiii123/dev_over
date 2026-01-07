import {
  DetailQuestionResponseDto,
  ListQuestionsResponseDto,
  QuestionResponseDto,
  AnalysisQuestionDto,
} from '../../gateway/question';

export type QuestionTcpResponse = QuestionResponseDto;
export type DetailQuestionTcpResponse = DetailQuestionResponseDto;
export type ListQuestionsTcpResponse = ListQuestionsResponseDto;
export type AnalysisQuestionTcpResponse = AnalysisQuestionDto;
