import React, { createContext } from 'react';
import { IUser } from '../../models';

export interface IAuthState {
  user: IUser | null;
  jwt: string | null;
}

export interface IAuthContext {
  state: IAuthState;
  setState: React.Dispatch<React.SetStateAction<IAuthState>>;
}

const AuthContext = createContext<IAuthContext>(null!);

export default AuthContext;
