import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetOAuthAuthorizationUrlResponseDto {
  @ApiProperty({ description: 'Google authorization URL' })
  @IsString()
  url: string;
}
