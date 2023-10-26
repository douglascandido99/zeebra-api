import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDTO } from './dto/create-user.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { CleanUser } from './protocols/types/clean-user';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatedUser } from './protocols/types/updated-user';
import { UpdatePasswordDTO } from './dto/update-password.dto';
import { MessageResponse } from '../common/protocols/interfaces/message-response.interface';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ReturnedUser } from './protocols/types/returned-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('register')
  async createUser(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.userService.createUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@GetUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<CleanUser[]> {
    return await this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReturnedUser> {
    return await this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update')
  async updateUser(
    @GetUser('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
  ): Promise<UpdatedUser | null> {
    return await this.userService.updateUser(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update-password')
  async updatePassword(
    @GetUser('id', ParseIntPipe) id: number,
    @Body()
    dto: UpdatePasswordDTO,
  ): Promise<MessageResponse> {
    return await this.userService.updatePassword(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/deactivate')
  async deactivateUser(
    @GetUser('id', ParseIntPipe) id: number,
  ): Promise<MessageResponse> {
    return await this.userService.deactivateUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/delete')
  async deleteUser(
    @GetUser('id', ParseIntPipe) id: number,
  ): Promise<MessageResponse> {
    return await this.userService.deleteUser(id);
  }
}
