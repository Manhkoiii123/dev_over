import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { AuthRepository } from '../../modules/auth/repositories/auth.repository';
import { AuthService } from '../../modules/auth/services/auth.service';
import { HashingService } from './hashing.service';
import { v4 as uuidv4 } from 'uuid';
import envConfig from '../config';
@Injectable()
export class GoogleService {
  private oauth2Client: OAuth2Client;
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly hashingService: HashingService,
    private readonly authService: AuthService
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI
    );
  }
  getAuthorizationUrl({ userAgent, ip }: { userAgent: string; ip: string }) {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const stateString = Buffer.from(JSON.stringify({ userAgent, ip })).toString(
      'base64'
    );
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: stateString,
      include_granted_scopes: true,
    });
    return { url };
  }
  async googleCallback({ code, state }: { code: string; state: string }) {
    try {
      let userAgent = 'Unknown';
      let ip = 'Unknown';
      try {
        // giải mã cái state từ url
        if (state) {
          const clientInfo = JSON.parse(
            Buffer.from(state, 'base64').toString()
          ) as { userAgent: string; ip: string };
          userAgent = clientInfo.userAgent;
          ip = clientInfo.ip;
        }
      } catch (error) {
        console.log(error);
      }
      // dùng code để lấy token
      const { tokens } = await this.oauth2Client.getToken({
        code: code,
        redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
      });
      this.oauth2Client.setCredentials(tokens);
      // lấy thông tin user
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      });
      const { data } = await oauth2.userinfo.get();
      if (!data.email) {
        throw new Error('Email is required');
      }
      let user = await this.authRepository.findUserByEmail(data.email);
      if (!user) {
        const uuid = uuidv4();
        const hashedPassword = await this.hashingService.hash(uuid);
        user = await this.authRepository.createUser({
          email: data.email,
          username: data.email.split('@')[0] + uuid.slice(0, 8),
          confirmPassword: hashedPassword,
          password: hashedPassword,
          ip: ip,
          userAgent: userAgent,
        });
      }
      const device = await this.authRepository.createDevice({
        userId: user.id,
        userAgent: userAgent,
        ip: ip,
      });
      const authTokens = await this.authService.generateTokens({
        userId: user.id,
        deviceId: device.id,
      });
      return authTokens;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
