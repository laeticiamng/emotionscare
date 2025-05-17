
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeSelector } from '@/components/theme/ThemeSelector';
import AudioControls from '@/components/audio/AudioControls';

const MainNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 dark:bg-background/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="mr-4">
          <Link 
            to="/" 
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
          >
            EmotionsCare
          </Link>
        </div>
        
        <nav className="mx-6 hidden items-center space-x-4 md:flex flex-1">
          <Link 
            to="/dashboard" 
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/emotions" 
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Émotions
          </Link>
          <Link 
            to="/journal" 
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Journal
          </Link>
          <Link 
            to="/community" 
            className="text-foreground/70 hover:text-foreground transition-colors"
          >
            Communauté
          </Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <AudioControls minimal className="mr-2" />
          <ThemeSelector minimal className="mr-2" />
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
