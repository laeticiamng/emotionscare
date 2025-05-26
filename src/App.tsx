
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <RouterProvider router={router}>
      <AuthProvider>
        <Toaster />
      </AuthProvider>
    </RouterProvider>
  );
}

export default App;
