import { useNavigate } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';

export const useNavigateWithLoading = () => {
  const navigate = useNavigate();
  const { showRouteLoading, hideRouteLoading } = useLoading();

  const navigateWithLoading = (
    to: string, 
    options?: { 
      replace?: boolean; 
      state?: any; 
      loadingMessage?: string;
      delay?: number;
    }
  ) => {
    const { 
      replace = false, 
      state, 
      loadingMessage = 'Loading page...', 
      delay = 300 
    } = options || {};

    // Show loading immediately
    showRouteLoading(loadingMessage);

    // Navigate after a short delay to show loading state
    setTimeout(() => {
      navigate(to, { replace, state });
      
      // Hide loading after navigation
      setTimeout(() => {
        hideRouteLoading();
      }, 100);
    }, delay);
  };

  return navigateWithLoading;
};
