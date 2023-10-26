import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtRepository } from '../common/jwt/repository/jwt.repository';
import { AuthRepository } from './repository/auth.repository';
import { MailRepository } from 'src/common/mail/repository/mail.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { JwtStrategy } from 'src/common/jwt/strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtRepository,
    AuthRepository,
    MailRepository,
    UserRepository,
    JwtService,
    JwtStrategy,
    PrismaService,
  ],
})
export class AuthModule {}
