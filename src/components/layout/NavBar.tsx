
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          EmotionsCare
        </Link>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button onClick={logout} variant="outline">
              Déconnexion
            </Button>
          ) : (
            <Link to="/choose-mode">
              <Button>Se connecter</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
