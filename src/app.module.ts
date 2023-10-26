import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaService } from './common/prisma/prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAILER_HOST,
          auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASS,
          },
        },
      }),
    }),
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
