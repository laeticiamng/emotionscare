import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AsyncState } from "@/components/transverse";

/**
 * AppDispatcher - Redirects users to appropriate dashboard based on role
 * Route: /app
 * Role: any (authenticated users only)
 */
export default function AppDispatcher() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Get user role from user metadata or direct role field
    const userRole = user.role || user.user_metadata?.role;

    // Dispatch to appropriate dashboard
    switch (userRole) {
      case 'consumer':
      case 'b2c':
        navigate('/app/home');
        break;
      case 'employee':
      case 'b2b_user':
        navigate('/app/collab');
        break;
      case 'manager':
      case 'b2b_admin':
        navigate('/app/rh');
        break;
      default:
        // Default to consumer dashboard
        navigate('/app/home');
        break;
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" data-testid="page-root">
      <div className="text-center space-y-4">
        <AsyncState.Loading message="Redirection en cours..." />
        <p className="text-sm text-muted-foreground">
          Nous vous dirigeons vers votre espace personnel...
        </p>
      </div>
    </div>
  );
}