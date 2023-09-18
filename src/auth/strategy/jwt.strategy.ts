import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { IJwtStrategy } from '../interfaces/jwt-strategy.interface';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
  implements IJwtStrategy
{
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: number; username: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });
      if (user) {
        delete user.hash;
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('An error occurred while validating the JWT token.');
    }
  }
}
