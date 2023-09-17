import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('users')
export class UserController implements IUser {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @Patch()
  async updateUser(@Body() dto: UpdateUserDTO): Promise<User> {
    return await this.userService.updateUser(dto);
  }

  @Delete()
  async deleteUser() {}
}
