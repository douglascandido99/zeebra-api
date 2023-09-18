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
import { IPosts } from './interfaces/posts.interface';
import { Posts } from '@prisma/client';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostsController implements IPosts {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  async createPost(
    @GetUser('id') userId: number,
    @Body() dto: CreatePostDTO,
  ): Promise<Posts> {
    return await this.postsService.createPost(userId, dto);
  }

  @Get(':id')
  async getPostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<Posts> {
    return await this.postsService.getPostById(userId, postId);
  }

  @Get()
  async getAllPosts(@GetUser('id') userId: number): Promise<Posts[]> {
    return await this.postsService.getAllPosts(userId);
  }

  @Patch(':id')
  async updatePost(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDTO,
  ): Promise<Posts> {
    return await this.postsService.updatePost(userId, postId, dto);
  }

  @Delete(':id')
  async deletePostById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<{ msg: string }> {
    return await this.postsService.deletePostById(userId, postId);
  }
}
