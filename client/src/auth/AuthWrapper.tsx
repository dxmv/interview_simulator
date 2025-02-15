import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show nothing while checking authentication
  if (loading) {
    return null; // Or a loading spinner if you prefer
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthWrapper;
