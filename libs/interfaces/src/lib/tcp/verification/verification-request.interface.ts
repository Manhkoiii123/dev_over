import {
  SendOtpBodyDto,
  ValidateVerificationCodeDto,
} from '../../gateway/verification';
export type ValidateVerificationCodeBodyTcpRequest =
  ValidateVerificationCodeDto & {
    userAgent: string;
    ip: string;
  };

export type SendOtpBodyTcpRequest = SendOtpBodyDto & {
  userAgent: string;
  ip: string;
};
