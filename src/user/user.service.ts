import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService implements IUser {
  constructor(private readonly prisma: PrismaService) {}
  async createUser(dto: CreateUserDTO): Promise<User> {}
  async updateUser(dto: UpdateUserDTO): Promise<User> {}
  async deleteUser() {}
}
