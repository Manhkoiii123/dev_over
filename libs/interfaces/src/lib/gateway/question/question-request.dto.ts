import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

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
