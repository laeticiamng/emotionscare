
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

// Lazy load components
const Home = React.lazy(() => import('./Home'));

const AppRouter: React.FC = () => {
  console.log('AppRouter rendering with React:', !!React);
  
  return (
    <React.Suspense fallback={<LoadingIllustration />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
