import { useEffect } from 'react';
import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import AuthContext, { IAuthState } from './AuthContext';

const LOCALSTORAGE_AUTH_KEY = 'auth';

export interface IProps {
  children?: React.ReactNode;
}

export function AuthContextProvider({ children }: IProps) {
  const [storedState, setStoredState] = useLocalStorage<IAuthState | null>(
    LOCALSTORAGE_AUTH_KEY,
    null
  );
  const [state, setState] = useState<IAuthState>({
    user: null,
    jwt: null,
  });

  // Sync stored state with context state
  useEffect(() => {
    if (storedState?.jwt && !state.jwt) {
      console.log('Loaded auth session from local storage');
      setState(storedState);
    }
  }, [state.jwt, storedState]);

  function clearAuth() {
    setStoredState(null);
    setState({
      user: null,
      jwt: null,
    });
  }

  function updateState(newState: IAuthState) {
    if (newState.jwt !== state.jwt) {
      setState(newState);
    }

    if (newState.jwt !== storedState?.jwt) {
      setStoredState(newState);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        updateState,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
