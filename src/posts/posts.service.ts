import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const post = await this.prisma.posts.findFirst({
      where: {
        id: postId,
        userId,
      },
    });

    if (!post)
      throw new NotFoundException(
        `The post you're trying to find doesn't exists.`,
      );

    return post;
  }

  async getAllPosts(userId: number): Promise<Posts[]> {
    const post = await this.prisma.posts.findMany({
      where: {
        userId,
      },
    });

    if (post.length === 0)
      throw new NotFoundException(`This user doesn't have any posts`);

    return post;
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

    if (!post) {
      throw new NotFoundException(
        `The post you're trying to edit does not exist.`,
      );
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        `You don't have permission to edit this post.`,
      );
    }

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

    if (!post) {
      throw new NotFoundException(
        `The post you're trying to delete does not exist.`,
      );
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        `You don't have permission to delete this post.`,
      );
    }

    await this.prisma.posts.delete({
      where: {
        id: postId,
      },
    });

    return { msg: 'Post deleted.' };
  }
}
