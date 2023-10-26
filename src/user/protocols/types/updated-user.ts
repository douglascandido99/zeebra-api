import { User } from '@prisma/client';

export type UpdatedUser = Pick<
  User,
  | 'id'
  | 'name'
  | 'email'
  | 'username'
  | 'hash'
  | 'isActive'
  | 'isEmailVerified'
  | 'updatedAt'
>;
