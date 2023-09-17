import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { IPosts } from './interfaces/posts.interface';
import { Posts } from '@prisma/client';
import { PostsService } from './posts.service';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';

@Controller('posts')
export class PostsController implements IPosts {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  async createPost(dto: CreatePostDTO): Promise<Posts> {
    return await this.postsService.createPost(dto);
  }

  @Get(':id')
  async getPostById(userId: number, postId: number): Promise<Posts> {
    return await this.postsService.getPostById(userId, postId);
  }

  @Get()
  async getAllPosts(userId: number): Promise<Posts[]> {
    return await this.postsService.getAllPosts(userId);
  }

  @Get(':id')
  async getDraftById(userId: number, postId: number): Promise<Posts> {
    return await this.postsService.getDraftById(userId, postId);
  }

  @Get(':id')
  async getAllDrafts(userId: number): Promise<Posts[]> {
    return await this.postsService.getAllDrafts(userId);
  }

  @Patch(':id')
  async updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts> {
    return await this.postsService.updatePost(userId, postId, dto);
  }

  @Delete(':id')
  async deletePostById(userId: number, postId: number): Promise<string> {
    return await this.postsService.deletePostById(userId, postId);
  }

  @Delete()
  async deleteAllPosts(userId: number): Promise<string> {
    return await this.postsService.deleteAllPosts(userId);
  }
}
