import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageLoading } from '../components/LoadingSpinner';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  showRouteLoading: (message?: string) => void;
  hideRouteLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  const setLoading = useCallback((loading: boolean, message = 'Loading...') => {
    setIsLoading(loading);
    setLoadingMessage(message);
  }, []);

  const showRouteLoading = useCallback((message = 'Loading page...') => {
    setLoading(true, message);
  }, [setLoading]);

  const hideRouteLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        showRouteLoading,
        hideRouteLoading,
      }}
    >
      {children}
      <AnimatePresence>
        {isLoading && <PageLoading message={loadingMessage} />}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
};
