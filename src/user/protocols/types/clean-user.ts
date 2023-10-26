import { User } from '@prisma/client';

export type CleanUser = Pick<
  User,
  'id' | 'name' | 'email' | 'username' | 'isActive' | 'isEmailVerified'
>;
