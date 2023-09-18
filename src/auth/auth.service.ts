import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuth } from './interfaces/auth.interface';
import { LoginUserDTO } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class AuthService implements IAuth {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async loginUser(dto: LoginUserDTO): Promise<{ access_token: string }> {
    const userRecord = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      select: {
        id: true,
        username: true,
        hash: true,
      },
    });

    if (!userRecord) {
      throw new NotFoundException(
        `User with username '${dto.username}' not found.`,
      );
    }

    const passwordMatches = await argon.verify(userRecord.hash, dto.password);

    if (!passwordMatches) {
      throw new ForbiddenException('Wrong password.');
    }

    return this.signToken(userRecord.id, userRecord.username);
  }

  private async signToken(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      username,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });

    return { access_token };
  }
}
