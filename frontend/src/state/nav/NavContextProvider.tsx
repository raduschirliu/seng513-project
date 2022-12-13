import { useState } from 'react';
import NavContext from './NavContext';

export interface IProps {
  children?: React.ReactNode;
}

export function NavContextProvider({ children }: IProps) {
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);

  return (
    <NavContext.Provider
      value={{
        currentBoardId,
        setCurrentBoardId,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}
