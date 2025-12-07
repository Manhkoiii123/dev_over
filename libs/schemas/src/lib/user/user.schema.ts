import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
  IsNumber,
  IsInt,
  Min,
  IsEnum,
  IsDate,
} from 'class-validator';
import { USER_STATUS } from '@common/constants/enum/user-status.enum';
import { BaseDto } from '../base.schema';

export class User extends BaseDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  username: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @ApiProperty({ description: 'Phone number', nullable: true, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiProperty({ description: 'Avatar URL', nullable: true, required: false })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @ApiProperty({ description: 'User bio', nullable: true, required: false })
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiProperty({ description: 'Location', nullable: true, required: false })
  @IsOptional()
  @IsString()
  location?: string | null;

  @ApiProperty({
    description: 'Reputation score',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  reputation?: number;

  @ApiProperty({
    enum: USER_STATUS,
    description: 'User status',
    default: USER_STATUS.ACTIVE,
  })
  @IsEnum(USER_STATUS)
  status?: USER_STATUS;
}
