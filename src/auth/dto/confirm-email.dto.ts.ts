import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
