
import { BrowserRouter } from 'react-router-dom';
import { Suspense } from 'react';
import { AppProviders } from './providers/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import PageLoader from '@/components/PageLoader';
import AppRouter from './AppRouter';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AppRouter />
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </AppProviders>
  );
}

export default App;
