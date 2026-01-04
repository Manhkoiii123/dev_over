import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
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
