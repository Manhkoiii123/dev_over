import {
  AuthLoginResponseDto,
  AuthRefreshTokenResponseDto,
  AuthResponseDto,
  GetOAuthAuthorizationUrlResponseDto,
} from '../../gateway/auth';

export type AuthTcpResponse = AuthResponseDto;

export type LoginTcpResponse = AuthLoginResponseDto;

export type RefreshTokenTcpResponse = AuthRefreshTokenResponseDto;

export type GoogleOAuthUrlTcpResponse = GetOAuthAuthorizationUrlResponseDto;
