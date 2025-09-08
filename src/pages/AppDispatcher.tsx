import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * AppDispatcher - Redirects users to appropriate dashboard
 * Route: /app
 * Role: any (authenticated users only)
 */
export default function AppDispatcher() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to main scan page for now
    const timeout = setTimeout(() => {
      navigate('/app/scan');
    }, 1000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" data-testid="page-root">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium">EmotionsCare</p>
        <p className="text-sm text-muted-foreground">
          Nous vous dirigeons vers votre espace personnel...
        </p>
      </div>
    </div>
  );
}