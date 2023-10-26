import { User } from '@prisma/client';

export type ReturnedUser = Pick<
  User,
  'id' | 'name' | 'email' | 'username' | 'hash' | 'isActive' | 'isEmailVerified'
>;
