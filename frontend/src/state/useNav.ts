import { useContext } from 'react';
import NavContext, { INavContext } from './nav/NavContext';

export type NavData = INavContext;

export default function useNav(): NavData {
  return useContext(NavContext);
}
