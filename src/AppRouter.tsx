
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingAnimation from '@/components/ui/loading-animation';

// Import des pages principales
import ImmersiveHome from '@/pages/ImmersiveHome';
import B2BSelectionPage from '@/pages/b2b/SelectionPage';
import PhilosophyJourney from '@/pages/common/PhilosophyJourney';
import AboutPage from '@/pages/common/AboutPage';
import ContactPage from '@/pages/common/ContactPage';
import FaqPage from '@/pages/common/FaqPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

// Import des pages B2C
import B2CLoginPage from '@/pages/b2c/LoginPage';

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <LoadingAnimation text="Chargement de la page..." />
      </div>
    }>
      <Routes>
        {/* Routes communes */}
        <Route path="/" element={<ImmersiveHome />} />
        <Route path="/philosophy" element={<PhilosophyJourney />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/choose-mode" element={<ImmersiveHome />} />
        
        {/* Routes B2B */}
        <Route path="/b2b/selection" element={<B2BSelectionPage />} />
        
        {/* Routes B2C */}
        <Route path="/b2c/login" element={<B2CLoginPage />} />
        
        {/* Route 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
