import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerRequestDto {
  @ApiProperty({ description: 'Question ID' })
  @IsString()
  questionId: string;

  @ApiProperty({ description: 'Question content' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
