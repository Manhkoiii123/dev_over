import {
  DetailQuestionResponseDto,
  ListQuestionsResponseDto,
  QuestionResponseDto,
  AnalysisQuestionDto,
  QuestionAnswersResponseDto,
  HadSavedVotedDownVotedQuestionDto,
} from '../../gateway/question';

export type QuestionTcpResponse = QuestionResponseDto;
export type DetailQuestionTcpResponse = DetailQuestionResponseDto;
export type ListQuestionsTcpResponse = ListQuestionsResponseDto;
export type AnalysisQuestionTcpResponse = AnalysisQuestionDto;
export type QuestionAnswersTcpResponse = QuestionAnswersResponseDto;
export type HadSavedVotedDownVotedQuestionTcpResponse =
  HadSavedVotedDownVotedQuestionDto;
