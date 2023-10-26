import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UpdatePostDTO } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { Posts } from '@prisma/client';
import { MessageResponse } from 'src/common/protocols/interfaces/message-response.interface';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  async createPost(
    @Body() dto: CreatePostDTO,
    @GetUser('id', ParseIntPipe) userId: number,
  ): Promise<Posts> {
    return await this.postsService.createPost(dto, userId);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<Posts> {
    return await this.postsService.getPostById(id);
  }

  @Get(':userId/posts')
  async getAllPostsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Posts[]> {
    return await this.postsService.getAllPostsByUserId(userId);
  }

  @Patch(':id')
  async updatePost(
    @Body() dto: UpdatePostDTO,
    @Param('id') id: string,
    @GetUser('id', ParseIntPipe) userId: number,
  ): Promise<Posts | null> {
    return await this.postsService.updatePost(dto, id, userId);
  }

  @Delete(':id')
  async deletePost(
    @Param('id') id: string,
    @GetUser('id', ParseIntPipe) userId: number,
  ): Promise<MessageResponse> {
    return await this.postsService.deletePost(userId, id);
  }
}
