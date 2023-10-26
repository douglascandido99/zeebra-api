import { Injectable } from '@nestjs/common';
import { Posts, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: Prisma.PostsCreateInput): Promise<Posts> {
    return await this.prisma.posts.create({
      data,
    });
  }

  async getPostById(id: string): Promise<Posts | null> {
    return await this.prisma.posts.findFirst({
      where: {
        id,
      },
    });
  }

  async getAllPostsByUserId(userId: number): Promise<Posts[]> {
    return await this.prisma.posts.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updatePost(
    id: string,
    data: Prisma.PostsUpdateInput,
  ): Promise<Posts | null> {
    return await this.prisma.posts.update({
      where: {
        id,
      },
      data,
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.posts.delete({
      where: {
        id,
      },
    });
  }
}
