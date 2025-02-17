import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToken } from '../auth/TokenContext';
import { getCvAnalysis } from '../../services/cvServiceApi';

// Define the shape of the context data
interface CVContextType {
  hasUploadedCV: boolean;
  setHasUploadedCV: (value: boolean) => void;
  loading: boolean;
}

// Create the CV context with a default value of null
const CVContext = createContext<CVContextType | null>(null);

// Provider component to manage CV state and provide it to children
export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [hasUploadedCV, setHasUploadedCV] = useState<boolean>(false); // State for CV upload status
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const { getToken } = useToken(); // Get the token from the authentication context

  // Effect to check the CV upload status when the component mounts
  useEffect(() => {
    const checkCVStatus = async () => {
      try {
        const token = getToken(); // Retrieve the token
        if (!token) {
          setHasUploadedCV(false); // No token means no CV uploaded
          setLoading(false); // Stop loading
          return;
        }
        
        const analysis = await getCvAnalysis(); // Fetch CV analysis
        setHasUploadedCV(!!analysis); // Update upload status based on analysis result
      } catch (error) {
        setHasUploadedCV(false); // If there's an error, set upload status to false
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    checkCVStatus(); // Call the function to check CV status
  }, [getToken]); // Dependency array to re-run effect if getToken changes

  // Provide the context value to children components
  return (
    <CVContext.Provider value={{ hasUploadedCV, setHasUploadedCV, loading }}>
      {children}
    </CVContext.Provider>
  );
};

// Custom hook to use the CV context
export const useCV = () => {
  const context = useContext(CVContext); // Get the context
  if (!context) {
    throw new Error('useCV must be used within a CVProvider'); // Error if used outside of provider
  }
  return context; // Return the context value
}; 