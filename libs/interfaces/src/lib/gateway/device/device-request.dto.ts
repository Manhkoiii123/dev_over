import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsIP,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDeviceBodyDto {
  @IsInt()
  userId: number;

  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @IsString()
  @IsNotEmpty()
  @IsIP()
  ip: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastActive?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
