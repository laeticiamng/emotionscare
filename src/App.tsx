import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Fallback de chargement
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

// Import des pages existantes ou stubs
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').catch(() => ({ default: () => <div>Page de connexion</div> })));
const SignupPage = lazy(() => import('./pages/auth/SignupPage').catch(() => ({ default: () => <div>Page d'inscription</div> })));

// Pages temporaires
const TempPage = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">Cette page sera bientôt disponible</p>
    </div>
  </div>
);

// Pages simplifiées pour éviter les erreurs
const ScanPage = () => <TempPage title="Scan Émotionnel" />;
const CoachPage = () => <TempPage title="Coach IA" />;
const JournalPage = () => <TempPage title="Journal Intelligent" />;

// Pages temporaires
const B2CActivityPage = () => <TempPage title="Activités B2C" />;
const B2CMusicTherapyPage = () => <TempPage title="Musicothérapie" />;

// Pages d'erreur
const Page401 = () => <TempPage title="401 - Non autorisé" />;
const Page403 = () => <TempPage title="403 - Accès interdit" />;
const Page404 = () => <TempPage title="404 - Page non trouvée" />;

/**
 * APPLICATION SIMPLIFIÉE - EmotionsCare
 * Version stable sans imports complexes
 */
function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* App Routes */}
        <Route path="/app/*" element={
          <Routes>
            <Route index element={<TempPage title="Tableau de Bord" />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="coach" element={<CoachPage />} />
            <Route path="activity" element={<B2CActivityPage />} />
            <Route path="music" element={<B2CMusicTherapyPage />} />
          </Routes>
        } />
        
        {/* Error Pages */}
        <Route path="/401" element={<Page401 />} />
        <Route path="/403" element={<Page403 />} />
        <Route path="/404" element={<Page404 />} />
        
        {/* Catch All */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;