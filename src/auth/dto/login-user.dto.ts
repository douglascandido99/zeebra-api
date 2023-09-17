import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';

export class LoginUserDTO extends PartialType(CreateUserDTO) {
  readonly username?: string;
  readonly password?: string;
}
