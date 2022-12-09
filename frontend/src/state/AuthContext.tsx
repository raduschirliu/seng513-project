import { createContext } from 'react';

export interface IAuthContext {

}

const AuthContext = createContext<IAuthContext>({});

export default AuthContext;
