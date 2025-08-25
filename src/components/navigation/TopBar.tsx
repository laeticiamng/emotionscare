import React from 'react';
import { motion } from 'framer-motion';
import { NavigationItem } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, Search, Bell, Settings, User,
  Crown, FlaskConical, Clock, AlertTriangle 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface TopBarProps {
  currentItem?: NavigationItem;
  onSidebarToggle: () => void;
  sidebarCollapsed: boolean;
}

/**
 * Barre de navigation supérieure
 */
export const TopBar: React.FC<TopBarProps> = ({
  currentItem,
  onSidebarToggle,
  sidebarCollapsed
}) => {
  const { user } = useAuth();

  // Obtenir l'icône de statut appropriée
  const getStatusIcon = () => {
    if (!currentItem) return null;
    
    switch (currentItem.status) {
      case 'beta':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            <FlaskConical className="h-3 w-3 mr-1" />
            Bêta
          </Badge>
        );
      case 'coming-soon':
        return (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            <Clock className="h-3 w-3 mr-1" />
            Bientôt disponible
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Section gauche */}
      <div className="flex items-center space-x-4">
        {/* Toggle sidebar mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          className="md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Informations de la page courante */}
        {currentItem && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="flex items-center space-x-2">
              <currentItem.icon className="h-5 w-5 text-primary" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {currentItem.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentItem.description}
                </p>
              </div>
            </div>
            
            {/* Badges de statut et métadonnées */}
            <div className="flex items-center space-x-2">
              {currentItem.metadata?.premium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {getStatusIcon()}
            </div>
          </motion.div>
        )}
      </div>

      {/* Section droite */}
      <div className="flex items-center space-x-3">
        {/* Barre de recherche */}
        <Button
          variant="outline"
          className="hidden md:flex items-center space-x-2 min-w-[200px] justify-start text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          <span>Rechercher...</span>
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            ⌘K
          </kbd>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Toggle de thème */}
        <ThemeToggle />

        {/* Menu utilisateur */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Connecté
            </p>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};