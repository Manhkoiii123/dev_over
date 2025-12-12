import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { USER_STATUS } from '@common/constants/enum/user-status.enum';
export class AuthResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'User full name' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Avatar URL', nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string | null;

  @ApiProperty({ enum: USER_STATUS, description: 'User status' })
  @IsEnum(USER_STATUS)
  status: USER_STATUS;
}
