import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './contexts/LoadingContext';
import { AuthProvider } from './contexts/AuthContext';

const App = () => (
  <div className="dark bg-background min-h-screen font-sans">
    <AuthProvider>
      <LoadingProvider>
        <AppRoutes />
      </LoadingProvider>
    </AuthProvider>
  </div>
);

export default App;
