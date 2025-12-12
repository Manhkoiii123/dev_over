import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import {
  AuthTcpResponse,
  RegisterBodyTcpRequest,
} from '@common/interfaces/tcp/auth';
@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}
  async resgister(data: RegisterBodyTcpRequest) {
    const user = await this.authRepository.exists(data.email, data.username);
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const body = {
      email: data.email,
      username: data.username,
      password: data.password,
    };
    return this.authRepository.createUser(data);
  }
}
