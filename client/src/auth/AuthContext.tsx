import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getToken } from './local_storage';
import { getProfile } from '../services/userServiceApi';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Whether the user is authenticated
  const [loading, setLoading] = useState<boolean>(true); // Whether the authentication is loading

  useEffect(() => {
    /**
     * Validates the token and sets the isAuthenticated state
     */
    const validateToken = async () => {
      const token = getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        await getProfile(); // Validates token by making a request
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
