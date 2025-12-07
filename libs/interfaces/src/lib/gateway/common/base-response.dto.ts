import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty({ description: 'User ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Created at timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({ description: 'Deleted at timestamp', nullable: true })
  @IsDate()
  @IsOptional()
  deletedAt?: Date | null;
}
