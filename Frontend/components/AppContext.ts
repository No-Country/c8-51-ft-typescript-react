import { createContext } from 'react';
import { User } from '../App';
import { ICoin } from '../types';

interface AppContextProps {
  coins: ICoin[];
  setCoins: (coins: ICoin[]) => void;
  user: User;
  setUser: (user: User) => void;
}

const AppContext = createContext({} as AppContextProps);

export default AppContext;
