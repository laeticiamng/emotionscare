import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { routes } from '@/routerV2';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Home } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      {/* Header */}
      <header className="container flex justify-between items-center py-4 px-4">
        <Link to={routes.public.home()} className="flex items-center">
          <span className="font-bold text-xl">EmotionsCare</span>
        </Link>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to={routes.public.home()}>
              <Home className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <motion.main 
        className="flex-grow flex"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      
      {/* Footer */}
      <footer className="py-4 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
