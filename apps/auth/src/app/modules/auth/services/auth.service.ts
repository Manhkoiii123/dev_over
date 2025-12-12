import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repositories/auth.repository';
import {
  AuthTcpResponse,
  RegisterBodyTcpRequest,
} from '@common/interfaces/tcp/auth';
import { HashingService } from '../../shared/hashing.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService
  ) {}
  async register(data: RegisterBodyTcpRequest) {
    const user = await this.authRepository.exists(data.email, data.username);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    data.password = await this.hashingService.hash(data.password);

    return this.authRepository.createUser(data);
  }
}
