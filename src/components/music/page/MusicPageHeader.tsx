/**
 * MusicPageHeader - En-tête de la page musicothérapie
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Music, Sparkles, TrendingUp, User } from 'lucide-react';

interface MusicPageHeaderProps {
  hasPreferences: boolean;
  onOpenPreferences: () => void;
}

export const MusicPageHeader: React.FC<MusicPageHeaderProps> = ({
  hasPreferences,
  onOpenPreferences
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent/80">
          <Music className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Musicothérapie</h1>
          <p className="text-muted-foreground">Playlists thérapeutiques personnalisées</p>
        </div>
        {hasPreferences && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreferences}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Modifier mes préférences
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/app/music/analytics'}
          className="gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Analytics
        </Button>
        
        <Link to="/app/music/profile">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Mon Profil
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MusicPageHeader;
