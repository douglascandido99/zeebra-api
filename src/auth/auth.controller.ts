import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfirmEmailDTO } from './dto/confirm-email.dto.ts';
import { LoginUserDTO } from './dto/login-user.dto';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { AccessTokenPayload } from 'src/common/jwt/protocols/interfaces/access-token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() dto: LoginUserDTO): Promise<AccessTokenPayload> {
    return await this.authService.loginUser(dto);
  }

  @Post('confirm-email')
  async confirmEmail(@Body() dto: ConfirmEmailDTO): Promise<MessageResponse> {
    return await this.authService.confirmEmail(dto);
  }

  @Post('forgot-password')
  async sendResetPasswordEmail(
    @Body() email: string,
  ): Promise<MessageResponse> {
    return await this.authService.sendResetPasswordEmail(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDTO): Promise<MessageResponse> {
    return await this.authService.resetPassword(dto);
  }

  @Post('resend-confirm-email')
  async resendEmailConfirmLink(id: number): Promise<MessageResponse> {
    return await this.authService.resendConfirmEmailLink(id);
  }
}
