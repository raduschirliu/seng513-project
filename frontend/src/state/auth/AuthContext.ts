import React, { createContext } from 'react';
import { IUser } from '../../models';

export interface IAuthState {
  user: IUser | null;
  jwt: string | null;
}

export interface IAuthContext {
  state: IAuthState;
  updateState: (newState: IAuthState) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<IAuthContext>(null!);

export default AuthContext;
