import { createContext } from 'react';
import { ICoin } from '../types';

interface AppContextProps {
  coins: ICoin[];
  setCoins: (coins: ICoin[]) => void;
}

const AppContext = createContext({} as AppContextProps);

export default AppContext;
