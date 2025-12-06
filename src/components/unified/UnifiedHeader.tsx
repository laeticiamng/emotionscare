
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Bell, User, Search, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface UnifiedHeaderProps {
  onMenuToggle?: () => void;
  onMenuClick?: () => void;
}

const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ onMenuToggle, onMenuClick }) => {
  const navigate = useNavigate();
  const handleMenuClick = onMenuToggle || onMenuClick || (() => {});
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleMenuClick}
            className="hover:bg-muted"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              EmotionsCare
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/search')}
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => navigate('/notifications')}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => navigate('/profile')}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profil</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UnifiedHeader;
