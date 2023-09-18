import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class UserService implements IUser {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    const [existentEmail, existentUsername] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      }),
      this.prisma.user.findUnique({
        where: {
          username: dto.username,
        },
      }),
    ]);

    if (existentEmail)
      throw new ConflictException('This e-mail is already in use.');

    if (existentUsername)
      throw new ConflictException('This username is already in use.');

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          username: dto.username,
          hash,
        },
      });

      delete user.hash;
      return user;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(userId: number, dto: UpdateUserDTO): Promise<User> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }
  async deleteUser(userId: number): Promise<{ msg: string }> {
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return { msg: 'User deleted.' };
  }
}
