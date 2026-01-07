import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export enum QuestionFilter {
  NEWEST = 'newest',
  RECOMMENDED = 'recommended',
  FREQUENT = 'frequent',
  UNANSWERED = 'unanswered',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class ListQuestionsDto {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(50)
  limit?: number = 10;

  @ApiProperty({ description: 'Search query', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @ApiProperty({
    description: 'Post status filter',
    enum: PostStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({
    description: 'Question filter type',
    enum: QuestionFilter,
    required: false,
  })
  @IsOptional()
  @IsEnum(QuestionFilter)
  filter?: QuestionFilter;
}

export class CreateQuestionDto {
  @ApiProperty({ description: 'Question title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title!: string;

  @ApiProperty({ description: 'Question content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ description: 'Question tags', required: false })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  tags?: string[];
}

export class ListAnswersDto {
  @ApiProperty({ description: 'Page number', default: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    default: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(50)
  limit?: number = 10;
}
