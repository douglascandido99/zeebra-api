import { Injectable } from '@nestjs/common';
import { Comments, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    data: Prisma.CommentsUncheckedCreateInput,
  ): Promise<Comments> {
    return await this.prisma.comments.create({
      data,
    });
  }

  async getCommentById(id: number): Promise<Comments> {
    return await this.prisma.comments.findFirst({
      where: {
        id,
      },
    });
  }

  async getAllCommentsFromPostId(postId: string): Promise<Comments[]> {
    return await this.prisma.comments.findMany({
      where: {
        postId,
      },
    });
  }

  async updateComment(
    id: number,
    data: Prisma.CommentsUpdateInput,
  ): Promise<Comments> {
    return await this.prisma.comments.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteComment(id: number): Promise<void> {
    await this.prisma.comments.delete({
      where: {
        id,
      },
    });
  }
}
