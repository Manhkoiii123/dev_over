import {
  AuthLoginResponseDto,
  AuthRefreshTokenResponseDto,
  AuthResponseDto,
} from '../../gateway/auth';

export type AuthTcpResponse = AuthResponseDto;

export type LoginTcpResponse = AuthLoginResponseDto;

export type RefreshTokenTcpResponse = AuthRefreshTokenResponseDto;
