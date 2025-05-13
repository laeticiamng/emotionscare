
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Menu } from 'lucide-react';
import VoiceAssistant from '@/components/navigation/VoiceAssistant';
import { useAuth } from '@/contexts/AuthContext';

interface NavBarProps {
  onMenuToggle: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  
  return (
    <nav className="fixed w-full top-0 bg-background border-b z-50 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onMenuToggle} className="mr-2 md:hidden">
          <Menu />
        </Button>
        
        <Link to="/" className="text-xl font-bold mr-4">EmotionsCare</Link>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/dashboard" className="text-sm hover:text-primary">Tableau de bord</Link>
          <Link to="/journal" className="text-sm hover:text-primary">Journal</Link>
          <Link to="/coach-chat" className="text-sm hover:text-primary">Coach IA</Link>
          <Link to="/scan" className="text-sm hover:text-primary">Scan émotionnel</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Assistant vocal flottant */}
        <VoiceAssistant variant="icon" emotionalState="neutral" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        {!user && (
          <Link to="/login">
            <Button variant="outline" size="sm">
              Connexion
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
