import { LoginUserDTO } from '../dto/login-user.dto';

export interface IAuth {
  loginUser(dto: LoginUserDTO): Promise<{ access_token: string }>;
}
