import { Injectable, NotFoundException } from '@nestjs/common';
import { IPosts } from './interfaces/posts.interface';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { Posts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService implements IPosts {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: number, dto: CreatePostDTO): Promise<Posts> {
    const post = await this.prisma.posts.create({
      data: {
        userId,
        ...dto,
      },
    });
    return post;
  }

  async getPostById(userId: number, postId: number): Promise<Posts> {
    return await this.prisma.posts.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
  }

  async getAllPosts(userId: number): Promise<Posts[]> {
    return await this.prisma.posts.findMany({
      where: {
        userId,
      },
    });
  }

  async updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts> {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postId || post.userId !== userId)
      throw new NotFoundException(
        `The post you're trying to edit does not exists.`,
      );

    return await this.prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePostById(
    userId: number,
    postId: number,
  ): Promise<{ msg: string }> {
    const post = await this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postId || post.userId !== userId)
      throw new NotFoundException(
        `The post you're trying to delete does not exists.`,
      );

    await this.prisma.posts.delete({
      where: {
        id: postId,
      },
    });

    return { msg: 'Post deleted.' };
  }

  async deleteAllPosts(userId: number): Promise<{ msg: string }> {
    await this.prisma.posts.deleteMany({
      where: {
        id: userId,
      },
    });

    return { msg: 'All posts deleted.' };
  }
}
