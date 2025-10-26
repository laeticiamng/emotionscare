// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Sparkles, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function RewardsPage() {
  const { toast } = useToast();

  const rewards = [
    { id: 1, name: 'Thème Exclusif', points: 100, claimed: true, icon: Sparkles },
    { id: 2, name: 'Session VR Premium', points: 250, claimed: false, icon: Crown },
    { id: 3, name: 'Badge Spécial', points: 500, claimed: false, icon: Gift },
  ];

  const handleClaim = (reward: any) => {
    toast({
      title: 'Récompense récupérée !',
      description: `Vous avez récupéré: ${reward.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Récompenses</h1>
          <p className="text-muted-foreground">Échangez vos points contre des récompenses</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Points Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">1,250 points</div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            return (
              <Card key={reward.id}>
                <CardHeader>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle>{reward.name}</CardTitle>
                    <Badge variant="secondary">{reward.points} points</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {reward.claimed ? (
                    <Button disabled className="w-full">
                      Déjà récupéré
                    </Button>
                  ) : (
                    <Button onClick={() => handleClaim(reward)} className="w-full">
                      Récupérer
                    </Button>
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
