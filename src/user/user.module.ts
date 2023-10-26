import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthRepository } from 'src/auth/repository/auth.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './repository/user.repository';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { MailRepository } from 'src/common/mail/repository/mail.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtRepository } from 'src/common/jwt/repository/jwt.repository';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [
    UserService,
    AuthRepository,
    UserRepository,
    MailRepository,
    JwtService,
    JwtRepository,
    PrismaService,
  ],
})
export class UserModule {}
