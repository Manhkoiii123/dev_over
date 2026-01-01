import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve('apps/auth/.env');

console.log('=== ENV DEBUG ===');
console.log('Current working directory:', process.cwd());
console.log('Resolved env path:', envPath);
console.log('Env file exists:', fs.existsSync(envPath));

dotenv.config({
  path: envPath,
});

console.log(
  'GOOGLE_CLIENT_ID loaded:',
  process.env.GOOGLE_CLIENT_ID ? 'YES' : 'NO'
);
console.log('=================');

if (!fs.existsSync(envPath)) {
  console.log(`${envPath} file not found, create one`);
  process.exit(1);
}

export class EnvConfig {
  @IsString()
  DATABASE_URL: string;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: `${number}${'s' | 'm' | 'h' | 'd'}`;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: `${number}${'s' | 'm' | 'h' | 'd'}`;

  @IsString()
  SECRET_API_KEY: string;
  @IsString()
  GOOGLE_CLIENT_ID: string;
  @IsString()
  GOOGLE_CLIENT_SECRET: string;
  @IsString()
  GOOGLE_REDIRECT_URI: string;
  @IsString()
  GOOGLE_CLIENT_REDIRECT_URI: string;
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

console.log('=== ENVCONFIG DEBUG ===');
console.log('envConfig.GOOGLE_CLIENT_ID:', envConfig.GOOGLE_CLIENT_ID);
console.log('=======================');

export default envConfig;
