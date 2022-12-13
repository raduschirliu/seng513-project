import { IUser } from '../models';
import Api from './api';

export interface IAuthResponse {
  user: IUser;
  jwt: string;
}

export class AuthApi extends Api {
  constructor() {
    super('/auth');
  }

  login(username: string, password: string): Promise<IAuthResponse> {
    return this.api
      .post('/login', {
        username,
        password,
      })
      .then((res) => res.data as IAuthResponse);
  }

  createUser(
    username: string,
    password: string,
    fullName: string
  ): Promise<IAuthResponse> {
    return this.api
      .post('/signup', {
        username,
        password,
        fullName,
      })
      .then((res) => res.data as IAuthResponse);
  }
}
