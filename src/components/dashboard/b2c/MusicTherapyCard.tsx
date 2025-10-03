
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';

import useMusicFavorites from '@/hooks/useMusicFavorites';

interface MusicTherapyCardProps {
  className?: string;
}

const MusicTherapyCard: React.FC<MusicTherapyCardProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { favorites } = useMusicFavorites();
  const mainFavorite = favorites[0];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Thérapie musicale</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Music2 className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">Ta piste repère</p>
            {mainFavorite ? (
              <>
                <p>{mainFavorite.title ?? 'Ambiance personnalisée'}</p>
                <p className="text-xs text-muted-foreground">Toujours prête à être relancée en douceur.</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">
                Garde une bulle depuis le module Adaptive Music pour la retrouver ici.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="button" onClick={() => navigate('/app/music')}>
            Ouvrir ma bulle sonore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicTherapyCard;
