import {
  LoginBodyDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
} from '../../gateway/auth';

export type RegisterBodyTcpRequest = RegisterBodyDto & {
  userAgent: string;
  ip: string;
};

export type LoginBodyTcpRequest = LoginBodyDto & {
  userAgent: string;
  ip: string;
};

export type RefreshTokenBodyTcpRequest = RefreshTokenBodyDto & {
  userAgent: string;
  ip: string;
};
