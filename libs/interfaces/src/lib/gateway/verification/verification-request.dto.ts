import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  Length,
  IsDate,
} from 'class-validator';
import { TypeOfVerificationCode } from '@common/constants/enum/type-verification-code.enum';

export class VerificationCodeDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Type of verification code',
    enum: TypeOfVerificationCode,
  })
  @IsEnum(TypeOfVerificationCode)
  @IsNotEmpty()
  type: TypeOfVerificationCode;

  @ApiProperty({ description: 'Verification code (6 characters)' })
  @IsString()
  @Length(6, 6, { message: 'Code must be exactly 6 characters' })
  code: string;

  @ApiProperty({
    description: 'Expiration date of the verification code',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  expiresAt: Date;
}
