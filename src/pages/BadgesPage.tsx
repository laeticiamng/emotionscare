// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Zap } from 'lucide-react';

export default function BadgesPage() {
  const badges = [
    { id: 1, name: 'Débutant', icon: Star, rarity: 'Commun', earned: true, date: '2025-10-01' },
    { id: 2, name: 'Régulier', icon: Zap, rarity: 'Rare', earned: true, date: '2025-10-15' },
    { id: 3, name: 'Expert', icon: Trophy, rarity: 'Épique', earned: false },
    { id: 4, name: 'Maître Zen', icon: Award, rarity: 'Légendaire', earned: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Commun': return 'bg-slate-500';
      case 'Rare': return 'bg-blue-500';
      case 'Épique': return 'bg-purple-500';
      case 'Légendaire': return 'bg-amber-500';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Collection de Badges</h1>
          <p className="text-muted-foreground">Vos badges débloqués et à venir</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <Card key={badge.id} className={badge.earned ? 'border-primary' : 'opacity-60'}>
                <CardHeader>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`h-24 w-24 rounded-full flex items-center justify-center ${
                      badge.earned ? getRarityColor(badge.rarity) : 'bg-muted'
                    } text-white`}>
                      <Icon className="h-12 w-12" />
                    </div>
                    <div>
                      <CardTitle>{badge.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{badge.rarity}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  {badge.earned ? (
                    <p className="text-sm text-success">Obtenu le {badge.date}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Non débloqué</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
