import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ReturnedUser } from 'src/user/protocols/types/returned-user';
import { UserRepository } from 'src/user/repository/user.repository';
import { JwtTokenPayload } from '../protocols/interfaces/jwt-token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly user: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtTokenPayload): Promise<ReturnedUser> {
    try {
      const user = await this.user.findUserById(payload.id);

      if (user) {
        delete user.hash;
        return user;
      } else {
        return null;
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate JWT token');
    }
  }
}
