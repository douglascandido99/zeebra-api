import { Injectable } from '@nestjs/common';
import { IAuth } from './interfaces/auth.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService implements IAuth {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  loginUser(dto: LoginUserDTO): Promise<{ access_token: string }> {}
  signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {}
}
