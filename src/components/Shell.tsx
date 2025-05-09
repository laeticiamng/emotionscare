
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Headphones, Menu, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Define the props interface
interface ShellProps {
  children?: React.ReactNode;
}

const Shell: React.FC<ShellProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b sticky top-0 z-30">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">
              <Link to="/" className="hover:text-primary transition-colors">
                EmotionsCare
              </Link>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              type="button"
            >
              <Headphones className="h-4 w-4" />
              <span className="hidden sm:inline">Musique</span>
            </Button>

            {isAuthenticated ? (
              <Button variant="default" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Tableau de bord</span>
                </Link>
              </Button>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children || <Outlet />}
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EmotionsCare - Tous droits réservés</p>
            <p className="mt-2">Un espace dédié au bien-être émotionnel</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shell;
