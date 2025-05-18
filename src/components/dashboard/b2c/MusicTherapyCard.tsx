import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MusicTherapyCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/10 dark:to-pink-900/20 border-purple-100 dark:border-purple-900/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Music className="h-6 w-6 mr-2 text-purple-500" />
          Musicothérapie
        </CardTitle>
        <CardDescription>Sons adaptés à votre état émotionnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/20 p-4">
          <h3 className="font-medium text-purple-700 dark:text-purple-300">Playlist recommandée</h3>
          <p className="text-sm text-muted-foreground mt-1">Calme et Confiance</p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm">14 morceaux · 48 min</span>
            <Button size="sm" variant="secondary" className="bg-white/80 dark:bg-purple-900/50">
              Écouter
            </Button>
          </div>
        </div>
        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none" onClick={() => navigate('/b2c/music')}>
          Explorer la musicothérapie
        </Button>
      </CardContent>
    </Card>
  );
};

export default MusicTherapyCard;
