
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicProvider } from "@/contexts/MusicContext";
import { Suspense, useEffect } from "react";
import Home from "./Home";
import { PageLoadingFallback } from "@/components/ui/loading-fallback";
import { MeditationPage } from "@/utils/lazyRoutes";
import EnhancedErrorBoundary from "@/components/ui/enhanced-error-boundary";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import SecurityProvider from "@/components/security/SecurityProvider";
import { initServiceWorker } from "@/services/serviceWorker";
import { usePushNotifications } from "@/services/pushNotifications";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
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
    <SecurityProvider>
      <EnhancedErrorBoundary level="critical" showDetails={true}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <MusicProvider>
              <UXServicesInitializer />
              <SkipToContent />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<PageLoadingFallback />}>
                  <main id="main-content" tabIndex={-1}>
                    <Routes>
                      <Route path="/" element={
                        <EnhancedErrorBoundary level="page">
                          <Home />
                        </EnhancedErrorBoundary>
                      } />
                      <Route path="/meditation" element={
                        <EnhancedErrorBoundary level="page">
                          <MeditationPage />
                        </EnhancedErrorBoundary>
                      } />
                    </Routes>
                  </main>
                </Suspense>
              </BrowserRouter>
            </MusicProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </EnhancedErrorBoundary>
    </SecurityProvider>
  );
}

export default App;

