import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtRepository } from '../common/jwt/repository/jwt.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { ConfirmEmailDTO } from './dto/confirm-email.dto.ts';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthRepository } from './repository/auth.repository';
import { JwtTokenPayload } from '../common/jwt/protocols/interfaces/jwt-token-payload.interface';
import { AccessTokenPayload } from '../common/jwt/protocols/interfaces/access-token-payload.interface';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { MailRepository } from 'src/common/mail/repository/mail.repository';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtRepository,
    private readonly user: UserRepository,
    private readonly auth: AuthRepository,
    private readonly mail: MailRepository,
  ) {}

  async loginUser(dto: LoginUserDTO): Promise<AccessTokenPayload> {
    const { email, username, password } = dto;

    const user = await this.findUserByEmailOrUsername(email, username);

    if (!user) throw new NotFoundException('User not found');

    if (!user.isEmailVerified)
      throw new UnauthorizedException('Confirm your e-mail first');

    if (!(await this.auth.validatePassword(user.hash, password)))
      throw new UnauthorizedException('Invalid credentials');

    try {
      const accessTokenPayload: JwtTokenPayload = {
        id: user.id,
        e: user.email,
        u: user.username,
      };
      return {
        accessToken: await this.jwt.createAccessToken(accessTokenPayload),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async confirmEmail(dto: ConfirmEmailDTO): Promise<MessageResponse> {
    const { email, token } = dto;
    const user = await this.user.findUserByEmail(email);
    if (!user) throw new NotFoundException('E-mail not found');
    if (user.isEmailVerified)
      throw new BadRequestException('E-mail already confirmed');

    try {
      const payload = await this.jwt.decodeEmailConfirmationToken(token);

      if (typeof payload === 'object' && 'e' in payload) {
        await this.user.updateUser(user.id, {
          isEmailVerified: true,
        });
        return { msg: 'E-mail confirmed' };
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('E-mail confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async resetPassword(dto: ResetPasswordDTO): Promise<MessageResponse> {
    const { email, token, newPassword, newPasswordCheck } = dto;
    const user = await this.user.findUserByEmail(email);

    if (!user) throw new NotFoundException('E-mail not found');

    try {
      const payload = await this.jwt.decodeResetPasswordToken(token);

      if (typeof payload === 'object' && 'e' in payload) {
        await this.auth.comparePassword(newPassword, newPasswordCheck);

        const hash = await this.auth.hashPassword(newPassword);

        await this.user.updateUser(user.id, { hash: hash });

        return { msg: 'Your password has been updated' };
      }
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Reset password token expired');
      }
      throw new BadRequestException('Bad reset password token');
    }
  }

  async sendResetPasswordEmail(email: string): Promise<MessageResponse> {
    const user = await this.user.findUserByEmail(email);
    if (!user) throw new NotFoundException('E-mail not found');

    try {
      const payload: JwtTokenPayload = {
        e: user.email,
      };

      const token = await this.jwt.createResetPasswordToken(payload);

      const url = `${process.env.EMAIL_RESET_PASSWORD_URL}?token=${token}`;

      const text = `@${user.username}, to reset your password, click this link: ${url}`;

      await this.mail.sendResetPasswordLink(user.email, text);

      return { msg: 'E-mail sent' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send reset password e-mail',
      );
    }
  }

  async resendConfirmEmailLink(id: number): Promise<MessageResponse> {
    const user = await this.user.findUserById(id);
    if (!user) throw new NotFoundException('User not found');
    if (user.isEmailVerified)
      throw new BadRequestException('E-mail already confirmed');

    try {
      const payload: JwtTokenPayload = {
        e: user.email,
      };

      const token = await this.jwt.createEmailValidationToken(payload);

      const url = `${process.env.EMAIL_VALIDATION_TOKEN_SECRET}?token=${token}`;

      const text = `@${user.username}, Welcome to Zeebra. To validate your e-mail address, click this link: ${url}`;

      await this.mail.sendEmailValidationLink(user.email, text);

      return { msg: 'E-mail sent' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to resend confirmation e-mail',
      );
    }
  }

  private async findUserByEmailOrUsername(
    email: string | undefined,
    username: string | undefined,
  ): Promise<User | null> {
    if (email && username) throw new BadRequestException();

    if (!email && !username) throw new BadRequestException();

    if (email) return this.user.findUserByEmail(email);

    if (username) return this.user.findUserByUsername(username);

    return null;
  }
}
