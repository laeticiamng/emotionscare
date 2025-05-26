
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoadingIllustration } from '@/components/ui/loading-illustration';

// Lazy load the main page component
const Home = React.lazy(() => import('./Home'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingIllustration />}>
      <Routes>
        <Route path="/*" element={<Home />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
