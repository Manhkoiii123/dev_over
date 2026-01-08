import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GetMeResponseDto } from '../auth/auth-response.dto';

export class QuestionResponseDto {
  @ApiProperty({ description: 'Question ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Question title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Question content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Number of upvotes', default: 0 })
  @IsNumber()
  upvotes: number;

  @ApiProperty({ description: 'Number of downvotes', default: 0 })
  @IsNumber()
  downvotes: number;

  @ApiProperty({ description: 'Number of views', default: 0 })
  @IsNumber()
  viewsCount: number;

  @ApiProperty({ description: 'Author ID' })
  @IsNumber()
  authorId: number;

  @ApiProperty({ description: 'Created at timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  @IsDate()
  updatedAt: Date;
}

export class TagNameDto {
  @ApiProperty({ description: 'Tag name' })
  @IsString()
  name: string;
}

export class AnswerAuthorDto {
  @ApiProperty({ description: 'Author ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Author name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Author avatar' })
  @IsString()
  avatar: string;

  @ApiProperty({ description: 'Author email' })
  @IsString()
  email: string;
}

export class AnswerDto {
  @ApiProperty({ description: 'Answer ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Answer content' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Author ID' })
  @IsNumber()
  authorId: number;

  @ApiProperty({ description: 'Created at timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'Answer author details', type: AnswerAuthorDto })
  @Type(() => AnswerAuthorDto)
  author: AnswerAuthorDto;
}

export class DetailQuestionResponseDto extends QuestionResponseDto {
  @ApiProperty({
    description: 'Tags associated with the question',
    type: [TagNameDto],
  })
  @IsArray()
  @Type(() => TagNameDto)
  tags: TagNameDto[];

  @ApiProperty({ description: 'Author details', type: GetMeResponseDto })
  @Type(() => GetMeResponseDto)
  author: GetMeResponseDto;
}

export class FullDetailQuestionResponseDto extends DetailQuestionResponseDto {
  @ApiProperty({
    description: 'Answers to the question',
    type: [AnswerDto],
  })
  @IsArray()
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

export class QuestionListItemDto extends QuestionResponseDto {
  @ApiProperty({
    description: 'Tags associated with the question',
    type: [TagNameDto],
  })
  @IsArray()
  @Type(() => TagNameDto)
  tags: TagNameDto[];

  @ApiProperty({ description: 'Author details', type: GetMeResponseDto })
  @Type(() => GetMeResponseDto)
  author: GetMeResponseDto;

  @ApiProperty({ description: 'Number of answers' })
  @IsNumber()
  answersCount: number;

  @ApiProperty({ description: 'Number of bookmarks' })
  @IsNumber()
  bookmarksCount: number;
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  @IsNumber()
  limit: number;

  @ApiProperty({ description: 'Total number of items' })
  @IsNumber()
  total: number;

  @ApiProperty({ description: 'Total number of pages' })
  @IsNumber()
  totalPages: number;
}

export class QuestionAnswersResponseDto {
  @ApiProperty({
    description: 'List of answers for the question',
    type: [AnswerDto],
  })
  @IsArray()
  @Type(() => AnswerDto)
  data: AnswerDto[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}

export class ListQuestionsResponseDto {
  @ApiProperty({
    description: 'List of questions',
    type: [QuestionListItemDto],
  })
  @IsArray()
  @Type(() => QuestionListItemDto)
  data: QuestionListItemDto[];

  @ApiProperty({ description: 'Pagination metadata', type: PaginationMetaDto })
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
}

export class AnalysisQuestionDto {
  @ApiProperty({ description: 'Number of views' })
  @IsNumber()
  viewsCount: number;
  @ApiProperty({ description: 'Number of upvotes' })
  @IsNumber()
  upvotes: number;
  @ApiProperty({ description: 'Number of downvotes' })
  @IsNumber()
  downvotes: number;
  @ApiProperty({ description: 'Number of answers' })
  @IsNumber()
  answersCount: number;
}

export class HadSavedVotedDownVotedQuestionDto {
  @ApiProperty({ description: 'Has the question been upvoted' })
  @IsBoolean()
  isUpvoted: boolean;

  @ApiProperty({ description: 'Has the question been saved' })
  @IsBoolean()
  isSaved: boolean;

  @ApiProperty({ description: 'Has the question been downvoted' })
  @IsBoolean()
  isDownvoted: boolean;
}
