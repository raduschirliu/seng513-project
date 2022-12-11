import { useContext, useEffect, useRef } from 'react';
import Api from '../api/api';
import AuthContext from './auth/AuthContext';
import useAuth from './auth/useAuth';

interface IConstructor<T> {
  new (): T;
}

export default function useApi<T extends Api>(type: IConstructor<T>): T {
  const apiRef = useRef<T>(new type());
  const {
    state: { jwt },
  } = useContext(AuthContext);

  useEffect(() => {
    console.log('updated jwt', jwt);
    apiRef.current.setAuthToken(jwt);
  }, [jwt]);

  return apiRef.current;
}
