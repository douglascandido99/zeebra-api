import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from '../protocols/interfaces/jwt-token-payload.interface';

@Injectable()
export class JwtRepository {
  constructor(private readonly jwt: JwtService) {}

  async createAccessToken(payload: JwtTokenPayload): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES,
    });
  }

  async createEmailValidationToken(payload: JwtTokenPayload): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: process.env.EMAIL_VALIDATION_TOKEN_SECRET,
      expiresIn: process.env.EMAIL_VALIDATION_TOKEN_EXPIRES,
    });
  }

  async decodeEmailConfirmationToken(token: string): Promise<object> {
    return await this.jwt.verifyAsync(token, {
      secret: process.env.EMAIL_VALIDATION_TOKEN_SECRET,
    });
  }

  async createResetPasswordToken(payload: JwtTokenPayload): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: process.env.EMAIL_VALIDATION_TOKEN_SECRET,
      expiresIn: process.env.EMAIL_VALIDATION_TOKEN_EXPIRES,
    });
  }

  async decodeResetPasswordToken(token: string): Promise<object> {
    return await this.jwt.verifyAsync(token, {
      secret: process.env.EMAIL_VALIDATION_TOKEN_SECRET,
    });
  }
}
