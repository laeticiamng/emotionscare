
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MainNavbar: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-background border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">EmotionsCare</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
            À propos
          </Link>
          <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">
            Fonctionnalités
          </Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Tarifs
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
            Connexion
          </Button>
          <Button size="sm" onClick={() => navigate('/dashboard')}>
            Démarrer
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
