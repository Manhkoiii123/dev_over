import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env',
});

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('.env file not found, create one');
  process.exit(1);
}

export class EnvConfig {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  OTP_EXPIRES_IN: `${number}${'s' | 'm' | 'h' | 'd'}`;

  @IsString()
  RESEND_API_KEY: string;
}

export function validateEnv(env: NodeJS.ProcessEnv) {
  const config = plainToInstance(EnvConfig, env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(config, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.log('Các giá trị trong env ko hợp lệ');
    console.error(errors);
    process.exit(1);
  }

  return config;
}

const envConfig = validateEnv(process.env);
export default envConfig;
