// @ts-nocheck

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, User, Menu } from 'lucide-react';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';

const GuestMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  const handleDemoMode = () => {
    toast.info('Mode démo activé. Vous pouvez explorer l\'application avec des données de démonstration');
    navigate('/app/consumer/home');
  };

  const handleHelp = () => {
    navigate('/help');
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div 
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogin}
          className="hidden sm:flex"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Connexion
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          onClick={handleSignUp}
          size="sm"
          className="bg-gradient-to-r from-primary to-primary/80 hidden sm:flex"
        >
          <User className="h-4 w-4 mr-2" />
          S'inscrire
        </Button>
      </motion.div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="sm:hidden">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogin}>
            <LogIn className="h-4 w-4 mr-2" />
            Connexion
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignUp}>
            <User className="h-4 w-4 mr-2" />
            S'inscrire
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDemoMode}>
            Mode démo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHelp}>
            Aide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GuestMenu;
