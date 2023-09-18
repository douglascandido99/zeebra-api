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
    return this.prisma.posts.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getPostById(userId: number, postId: number): Promise<Posts> {
    const post = await this.findPostByIdAndUserId(postId, userId);
    if (!post) {
      throw new NotFoundException(
        `The post you're trying to find doesn't exist.`,
      );
    }
    return post;
  }

  async getAllPosts(userId: number): Promise<Posts[]> {
    const posts = await this.prisma.posts.findMany({
      where: {
        userId,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException(`This user doesn't have any posts`);
    }

    return posts;
  }

  async updatePost(
    userId: number,
    postId: number,
    dto: UpdatePostDTO,
  ): Promise<Posts> {
    const post = await this.findPostById(postId);

    this.validatePostOwnership(post, userId);

    return this.prisma.posts.update({
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
    const post = await this.findPostById(postId);

    this.validatePostOwnership(post, userId);

    await this.prisma.posts.delete({
      where: {
        id: postId,
      },
    });

    return { msg: 'Post deleted.' };
  }

  private async findPostById(postId: number): Promise<Posts | null> {
    return this.prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });
  }

  private async findPostByIdAndUserId(
    postId: number,
    userId: number,
  ): Promise<Posts | null> {
    return this.prisma.posts.findFirst({
      where: {
        id: postId,
        userId,
      },
    });
  }

  private validatePostOwnership(post: Posts | null, userId: number): void {
    if (!post) {
      throw new NotFoundException(
        `The post you're trying to edit/delete does not exist.`,
      );
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(
        `You don't have permission to edit/delete this post.`,
      );
    }
  }
}
