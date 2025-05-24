
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MusicProvider } from "@/contexts/MusicContext";
import { Suspense, useEffect } from "react";
import Home from "./Home";
import { PageLoadingFallback } from "@/components/ui/loading-fallback";
import { MeditationPage } from "@/utils/lazyRoutes";
import { GlobalErrorBoundary } from "@/components/ErrorBoundary/GlobalErrorBoundary";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import SecurityProvider from "@/components/security/SecurityProvider";
import { initServiceWorker } from "@/services/serviceWorker";
import { usePushNotifications } from "@/services/pushNotifications";

// Initialiser la validation d'environnement
import '@/lib/env-validation';
import '@/lib/errorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Ne pas retry sur les erreurs d'authentification
        if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Composant pour initialiser les services UX
const UXServicesInitializer: React.FC = () => {
  const { requestPermission } = usePushNotifications();

  useEffect(() => {
    // Initialiser le service worker
    initServiceWorker().catch(console.error);

    // Demander les permissions de notification après un délai
    const timer = setTimeout(() => {
      if ('Notification' in window && Notification.permission === 'default') {
        requestPermission().catch(console.error);
      }
    }, 5000); // Délai de 5 secondes pour ne pas être intrusif

    return () => clearTimeout(timer);
  }, [requestPermission]);

  return null;
};

function App() {
  return (
    <GlobalErrorBoundary>
      <SecurityProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <MusicProvider>
                <UXServicesInitializer />
                <SkipToContent />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<PageLoadingFallback />}>
                    <main id="main-content" tabIndex={-1}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/meditation" element={<MeditationPage />} />
                      </Routes>
                    </main>
                  </Suspense>
                </BrowserRouter>
              </MusicProvider>
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </SecurityProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
