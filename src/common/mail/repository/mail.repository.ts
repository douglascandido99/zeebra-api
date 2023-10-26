import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailRepository {
  constructor(private readonly mail: MailerService) {}

  async sendEmailValidationLink(
    email: string,
    text: string,
  ): Promise<SentMessageInfo> {
    return await this.mail.sendMail({
      to: email,
      subject: 'E-mail validation',
      text,
    });
  }

  async sendResetPasswordLink(
    email: string,
    text: string,
  ): Promise<SentMessageInfo> {
    return await this.mail.sendMail({
      to: email,
      subject: 'Reset password',
      text,
    });
  }
}
