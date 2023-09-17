import { LoginUserDTO } from '../dto/login-user.dto';

export interface IAuth {
  loginUser(dto: LoginUserDTO): Promise<{ access_token: string }>;
  signToken?(
    userId: number,
    username: string,
  ): Promise<{ access_token: string }>;
}
