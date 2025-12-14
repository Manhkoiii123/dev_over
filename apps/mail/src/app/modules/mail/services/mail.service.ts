import { TypeOfVerificationCode } from '@common/constants/enum/type-verification-code.enum';
import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MailRepository } from '../repositories/mail.repository';
import { SendOtpBodyTcpRequest } from '@common/interfaces/tcp/auth';
import { generateOTP } from '@common/utils/generate-otp.utils';
import ms from 'ms';
import { addMilliseconds } from 'date-fns';
import envConfig from '../../../shared/config';
import { ValidateVerificationCodeBodyTcpRequest } from '@common/interfaces/tcp/verification';
import { EmailService } from '../../../shared/services/email.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailRepository: MailRepository,
    private readonly emailService: EmailService
  ) {}
  async validateVerificationCode({
    email,
    code,
    type,
  }: ValidateVerificationCodeBodyTcpRequest) {
    const verifycationCode =
      await this.mailRepository.findUniqueVerificationCode({
        email_type_code: {
          email: email,
          type: type,
          code: code,
        },
      });

    if (!verifycationCode) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.InvalidOTP',
          path: 'code',
        },
      ]);
    }
    if (verifycationCode.expiresAt < new Date()) {
      throw new UnprocessableEntityException([
        {
          message: 'Error.OTPExpired',
          path: 'code',
        },
      ]);
    }
    return {
      message: 'OTP verified successfully',
    };
  }

  async sendOtp(data: SendOtpBodyTcpRequest) {
    // const user = await this.mailRepository.existsWithEmail(data.email);
    // if (!user) {
    //   throw new BadRequestException('User does not exist');
    // }
    // if (data.type === TypeOfVerificationCode.EMAIL_CONFIRMATION && user) {
    //   throw new UnprocessableEntityException([
    //     {
    //       message: 'Error.EmailExists',
    //       path: 'refreshToken',
    //     },
    //   ]);
    // }
    // if (data.type === TypeOfVerificationCode.PASSWORD_RESET && !user) {
    //   throw new UnprocessableEntityException([
    //     {
    //       message: 'Error.EmailNotFound',
    //       path: 'refreshToken',
    //     },
    //   ]);
    // }

    const code = generateOTP();
    await this.mailRepository.createVerificationCode({
      email: data.email,
      code,
      type: data.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN)),
    });
    const { data: _, error } = await this.emailService.sendOTP({
      email: data.email,
      code,
    });
    if (error) {
      throw new UnprocessableEntityException('Failed to send email');
    }
    return {
      message: 'OTP sent successfully',
    };
  }
}
