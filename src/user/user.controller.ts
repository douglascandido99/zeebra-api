import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IUser } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('users')
export class UserController implements IUser {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async getUser(@GetUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.updateUser(userId, dto);
  }
  @UseGuards(JwtGuard)
  @Delete('me')
  async deleteUser(@GetUser('id') userId: number): Promise<{ msg: string }> {
    return await this.userService.deleteUser(userId);
  }
}
