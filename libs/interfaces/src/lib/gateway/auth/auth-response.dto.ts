import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

export class AuthLoginResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'Access token' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string;
}
export class AuthRefreshTokenResponseDto extends AuthLoginResponseDto {}

export class GetMeResponseDto extends BaseResponseDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Avatar URL', nullable: true })
  @IsString()
  @IsOptional()
  avatar?: string | null;

  @ApiProperty({ description: 'User bio', nullable: true })
  @IsString()
  @IsOptional()
  bio?: string | null;

  @ApiProperty({ description: 'User location', nullable: true })
  @IsString()
  @IsOptional()
  location?: string | null;

  @ApiProperty({ description: 'User reputation score' })
  @IsNumber()
  reputation: number;

  @ApiProperty({ enum: USER_STATUS, description: 'User status' })
  @IsEnum(USER_STATUS)
  status: USER_STATUS;
}
