import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface TokenContextType {
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const TokenContext = createContext<TokenContextType | null>(null);

const TOKEN_KEY = 'token';

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const { setIsAuthenticated } = useAuth();

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  return (
    <TokenContext.Provider value={{ login, logout, getToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}; 