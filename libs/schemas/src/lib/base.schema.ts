import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDate } from 'class-validator';

export class BaseDto {
  @ApiProperty({ description: 'ID of the entity' })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Deleted timestamp',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsDate()
  deletedAt?: Date | null;

  @ApiProperty({ description: 'Created timestamp' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', required: false })
  @IsOptional()
  @IsDate()
  updatedAt?: Date | null;
}
