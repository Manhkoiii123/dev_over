import {
  SendOtpBodyDto,
  ValidateVerificationCodeDto,
  ForgotPasswordBodyDto,
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

export type ForgotPasswordTcpRequest = ForgotPasswordBodyDto & {
  userAgent: string;
  ip: string;
};
