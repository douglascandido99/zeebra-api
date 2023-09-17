import { ICreateUser } from '../interfaces/create-user.interface';

export class CreateUserDTO implements ICreateUser {
  readonly name: string;
  readonly email: string;
  readonly username: string;
  readonly password: string;
}
