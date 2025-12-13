import { LoginBodyDto, RegisterBodyDto } from '../../gateway/auth';

export type RegisterBodyTcpRequest = RegisterBodyDto;

export type LoginBodyTcpRequest = LoginBodyDto & {
  userAgent: string;
  ip: string;
};
