import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly token: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  @IsStrongPassword()
  readonly newPasswordCheck: string;
}
