
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User } from 'lucide-react';
import { toast } from 'sonner';

const GuestMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    toast.info('Navigation vers la page de connexion');
    navigate('/login');
  };

  const handleSignUp = () => {
    toast.info('Navigation vers la page d\'inscription');
    navigate('/register');
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleLogin}
        className="hidden sm:flex"
      >
        <LogIn className="h-4 w-4 mr-2" />
        Connexion
      </Button>
      <Button 
        onClick={handleSignUp}
        size="sm"
        className="bg-gradient-to-r from-primary to-primary/80"
      >
        <User className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">S'inscrire</span>
        <span className="sm:hidden">Inscription</span>
      </Button>
    </div>
  );
};

export default GuestMenu;
