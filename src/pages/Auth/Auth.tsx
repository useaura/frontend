import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Mock Google sign-in - in real app, integrate with Google Auth
    console.log('Google sign-in clicked');
    // Simulate successful auth and redirect to home
    setTimeout(() => navigate('/home'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background-tertiary flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-surface/10 rounded-full opacity-30 blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-surface/10 rounded-full opacity-30 blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-surface/5 rounded-full opacity-20 blur-3xl animate-pulse-glow"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* App Logo */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-surface border border-border rounded-xl flex items-center justify-center mb-4 shadow-sm mx-auto">
            <span className="text-3xl font-bold text-text-primary">A</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            AuraPay
          </h1>
        </div>

        {/* Sign In Card */}
        <div className="bg-surface border border-border/20 rounded-xl p-8 shadow-sm animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-surface text-text-primary font-semibold py-4 px-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:border-border/60 hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          {/* Info Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              We will create your wallet automatically
            </p>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="w-12 h-12 bg-surface border border-border/20 rounded-xl flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-text-secondary">Secure</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-surface border border-border/20 rounded-xl flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-xs text-text-secondary">Fast</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-surface border border-border/20 rounded-xl flex items-center justify-center mx-auto mb-2 hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-text-secondary">Reliable</p>
          </div>
        </div>
      </div>
    </div>
  );
};
