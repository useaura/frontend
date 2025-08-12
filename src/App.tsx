import AppRoutes from './routes/AppRoutes';
import { LoadingProvider } from './contexts/LoadingContext';

const App = () => (
  <div className="dark bg-background min-h-screen font-sans">
    <LoadingProvider>
      <AppRoutes />
    </LoadingProvider>
  </div>
);

export default App;
