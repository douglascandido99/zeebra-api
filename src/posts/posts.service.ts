import { Injectable } from '@nestjs/common';
import { IPosts } from './interfaces/posts.interface';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { Posts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService implements IPosts {
  constructor(private readonly prisma: PrismaService) {}
  async createPost(dto: CreatePostDTO): Promise<Posts> {}
  async getPostById(userId: number, postId: number): Promise<Posts> {}
  async getAllPosts(userId: number): Promise<Posts[]> {}
  async getDraftById(userId: number, postId: number): Promise<Posts> {}
  async getAllDrafts(userId: number): Promise<Posts[]> {}
  async updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts> {}
  async deletePostById(userId: number, postId: number): Promise<string> {}
  async deleteAllPosts(userId: number): Promise<string> {}
}
