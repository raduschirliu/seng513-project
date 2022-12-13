import { useContext } from 'react';
import { AuthApi } from '../../api/auth';
import useApi from '../useApi';
import AuthContext from './AuthContext';

export default function useAuth() {
  const { state, clearAuth, updateState } = useContext(AuthContext);
  const authApi = useApi(AuthApi);

  function isLoggedIn() {
    return !!state?.user;
  }

  function logout() {
    clearAuth();
  }

  function login(username: string, password: string) {
    return authApi.login(username, password).then((data) => {
      if (!data) {
        console.error('Invalid login data', data);
        return;
      }

      updateState({
        user: data.user,
        jwt: data.jwt,
      });

      // TODO: Store token in localstorage

      return data.user;
    });
  }

  function signUp(username: string, fullName: string, password: string) {
    return authApi.createUser(username, password, fullName).then((data) => {
      if (!data) {
        console.error('Invalid signup data', data);
        return;
      }

      updateState({
        user: data.user,
        jwt: data.jwt,
      });

      return data.user;
    });
  }

  return {
    user: state.user,
    jwt: state.jwt,
    login,
    logout,
    isLoggedIn,
    signUp,
  };
}
