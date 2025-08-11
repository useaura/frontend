import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading and auth check
    const timer = setTimeout(() => {
      setIsLoading(false);
      // For now, redirect to auth. In real app, check if user is authenticated
      navigate('/auth');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-100 rounded-full opacity-30 blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* App Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-glow mx-auto">
            <span className="text-5xl font-bold text-white">A</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            AuraPay
          </h1>
        </div>

        {/* Tagline */}
        <div className="mb-16">
          <p className="text-xl text-text-secondary font-medium">
            Tap. Send. Receive.
          </p>
          <p className="text-sm text-text-tertiary mt-2">
            The future of digital payments
          </p>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-text-secondary mt-4 font-medium">Loading...</p>
          </div>
        )}
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="fill-primary-100"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="fill-primary-200"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="fill-primary-300"
          ></path>
        </svg>
      </div>
    </div>
  );
};
