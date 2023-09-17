import { Body, Controller, Post } from '@nestjs/common';
import { IAuth } from './interfaces/auth.interface';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController implements IAuth {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body() dto: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    return await this.authService.loginUser(dto);
  }
}
