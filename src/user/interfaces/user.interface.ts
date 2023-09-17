import { User } from '@prisma/client';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';

export interface IUser {
  createUser(dto: CreateUserDTO): Promise<User>;
  updateUser(id: number, dto: UpdateUserDTO): Promise<User>;
  deleteUser(): Promise<void>;
}
