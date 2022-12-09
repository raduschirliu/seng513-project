import { useState } from 'react';
import AuthContext, { IAuthState } from './AuthContext';

export interface IProps {
  children?: React.ReactNode;
}

export function AuthContextProvider({ children }: IProps) {
  const [state, setState] = useState<IAuthState>({
    user: null,
    jwt: null,
  });

  return (
    <AuthContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
