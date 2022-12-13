import React, { createContext } from 'react';

export interface INavContext {
  currentBoardId: string | null;
  setCurrentBoardId: React.Dispatch<React.SetStateAction<string | null>>;
}

const NavContext = createContext<INavContext>({
  currentBoardId: null,
  setCurrentBoardId: () => {},
});

export default NavContext;
