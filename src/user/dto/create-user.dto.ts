import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { ICreateUser } from '../interfaces/create-user.interface';

export class CreateUserDTO implements ICreateUser {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @Length(1, 30)
  @Matches(RegExp(/^[A-Za-z0-9-_]+$/))
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly password: string;
}
