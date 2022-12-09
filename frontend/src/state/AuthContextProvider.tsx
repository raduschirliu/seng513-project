import AuthContext from './AuthContext';

export interface IProps {
  children?: React.ReactNode;
}

export function AuthContextProvider({ children }: IProps) {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
