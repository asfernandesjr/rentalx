import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokensDTO';
import { UserTokens } from '../infra/typeorm/entities/UserTokens';

interface IUsersTokensRepository {

  create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO) : Promise<UserTokens>;
  findByUserIdAndRefreshToken(user_id: string, refresh_token: string) : Promise<UserTokens | null>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(refresh_token: string): Promise<UserTokens | null>;
}

export { IUsersTokensRepository };
