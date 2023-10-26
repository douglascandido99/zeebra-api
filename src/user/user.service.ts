import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from 'src/auth/repository/auth.repository';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { CleanUser } from './protocols/types/clean-user';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatedUser } from './protocols/types/updated-user';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';
import { MailRepository } from 'src/common/mail/repository/mail.repository';
import { JwtRepository } from 'src/common/jwt/repository/jwt.repository';
import { ReturnedUser } from './protocols/types/returned-user';
import { JwtTokenPayload } from 'src/common/jwt/protocols/interfaces/jwt-token-payload.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly auth: AuthRepository,
    private readonly user: UserRepository,
    private readonly mail: MailRepository,
    private readonly jwt: JwtRepository,
  ) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const { name, email, username, password } = dto;
    const [existentEmail, existentUsername] = await Promise.all([
      this.user.findUserByEmail(email),
      this.user.findUserByUsername(username),
    ]);

    if (existentEmail)
      throw new ConflictException('This e-mail is already in use');

    if (existentUsername)
      throw new ConflictException('This username is already in use');

    try {
      const hash = await this.auth.hashPassword(password);

      const user = await this.user.createUser({
        name,
        email,
        username,
        hash,
      });

      const payload: JwtTokenPayload = {
        e: email,
      };

      const token = await this.jwt.createEmailValidationToken(payload);

      const url = `${process.env.EMAIL_VALIDATION_URL}?token=${token}`;

      const text = `@${username}, Welcome to Zeebra. To validate your e-mail address, click this link: ${url}`;

      await this.mail.sendEmailValidationLink(email, text);

      delete user.hash;

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Falied to create user');
    }
  }

  async getUserById(id: number): Promise<ReturnedUser> {
    const user = await this.user.findUserById(id);
    if (!user) throw new NotFoundException(`User with id '${id}' not found`);
    try {
      delete user.hash;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get user');
    }
  }

  async getAllUsers(): Promise<CleanUser[]> {
    try {
      return await this.user.findAllUsers();
    } catch (error) {
      throw new InternalServerErrorException('Failed to get users');
    }
  }

  async updateUser(id: number, dto: UpdateUserDTO): Promise<UpdatedUser> {
    const userId = await this.user.findUserById(id);
    if (!userId) throw new NotFoundException(`User with id '${id}' not found`);

    const existentUsername = await this.user.findUserByUsername(dto.username);

    if (dto.username) {
      if (existentUsername && userId.id !== id)
        throw new ConflictException('This username is already in use');
    }

    try {
      const user = await this.user.updateUser(id, dto);

      delete user.hash;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async updatePassword(
    id: number,
    dto: UpdatePasswordDTO,
  ): Promise<MessageResponse> {
    const userId = await this.user.findUserById(id);
    if (!userId) throw new NotFoundException(`User with id '${id}' not found`);

    await this.auth.comparePassword(dto.newPassword, dto.newPasswordCheck);

    if (!(await this.auth.validatePassword(userId.hash, dto.currentPassword)))
      throw new UnauthorizedException('Invalid password');

    if (dto.currentPassword === dto.newPassword)
      throw new BadRequestException(
        'Your new password cannot be the same as your current password',
      );

    try {
      const hash = await this.auth.hashPassword(dto.newPassword);

      await this.user.updateUser(id, { hash: hash });

      return { msg: 'Password updated' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async deactivateUser(id: number): Promise<MessageResponse> {
    const userId = await this.user.findUserById(id);
    if (!userId) throw new NotFoundException(`User with id '${id}' not found`);

    if (!userId.isActive)
      throw new BadRequestException('User already deactivated');

    try {
      await this.user.updateUser(id, { isActive: false });

      return { msg: 'User deactivated' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to deactivate user');
    }
  }

  async deleteUser(id: number): Promise<MessageResponse> {
    const userId = await this.user.findUserById(id);
    if (!userId) throw new NotFoundException(`User with id '${id}' not found`);

    try {
      await this.user.deleteUser(id);

      return { msg: 'User deleted' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
