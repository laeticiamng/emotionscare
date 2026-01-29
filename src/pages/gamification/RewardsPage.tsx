import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Sparkles, Crown, Lock, Palette, Music, Zap, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  claimed: boolean;
  icon: typeof Sparkles;
  category: 'themes' | 'music' | 'features' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockLevel?: number;
}

const rewards: Reward[] = [
  { id: 1, name: 'Thème Aurore', description: 'Palette de couleurs apaisante', points: 100, claimed: true, icon: Palette, category: 'themes', rarity: 'common' },
  { id: 2, name: 'Thème Nuit Étoilée', description: 'Mode sombre élégant', points: 150, claimed: false, icon: Palette, category: 'themes', rarity: 'rare' },
  { id: 3, name: 'Pack Sons Nature', description: '10 ambiances sonores relaxantes', points: 200, claimed: false, icon: Music, category: 'music', rarity: 'common' },
  { id: 4, name: 'Musique Lo-Fi Premium', description: 'Accès à 50 morceaux exclusifs', points: 350, claimed: false, icon: Music, category: 'music', rarity: 'rare' },
  { id: 5, name: 'Session VR Premium', description: 'Accès aux environnements VR avancés', points: 250, claimed: false, icon: Crown, category: 'features', rarity: 'epic' },
  { id: 6, name: 'Analyse IA Avancée', description: 'Insights détaillés sur vos émotions', points: 400, claimed: false, icon: Zap, category: 'features', rarity: 'epic', unlockLevel: 10 },
  { id: 7, name: 'Badge Légende', description: 'Badge exclusif pour votre profil', points: 500, claimed: false, icon: Trophy, category: 'special', rarity: 'legendary', unlockLevel: 15 },
  { id: 8, name: 'Thème Arc-en-ciel', description: 'Thème dynamique multicolore', points: 600, claimed: false, icon: Sparkles, category: 'special', rarity: 'legendary', unlockLevel: 20 },
];

const rarityColors = {
  common: 'border-muted-foreground/30 bg-muted/10',
  rare: 'border-blue-500/30 bg-blue-500/10',
  epic: 'border-purple-500/30 bg-purple-500/10',
  legendary: 'border-yellow-500/30 bg-yellow-500/10',
};

const rarityLabels = {
  common: { label: 'Commun', color: 'bg-muted text-muted-foreground' },
  rare: { label: 'Rare', color: 'bg-blue-500/20 text-blue-600' },
  epic: { label: 'Épique', color: 'bg-purple-500/20 text-purple-600' },
  legendary: { label: 'Légendaire', color: 'bg-yellow-500/20 text-yellow-600' },
};

export default function RewardsPage() {
  const { toast } = useToast();
  const { points } = useHarmonyPoints();
  const [claimedRewards, setClaimedRewards] = useState<number[]>([1]);
  const userPoints = points?.totalPoints || 1250;
  const userLevel = 8; // Simulé

  const handleClaim = (reward: Reward) => {
    if (userPoints < reward.points) {
      toast({ 
        title: 'Points insuffisants', 
        description: `Il vous manque ${reward.points - userPoints} points.`,
        variant: 'destructive'
      });
      return;
    }
    
    if (reward.unlockLevel && userLevel < reward.unlockLevel) {
      toast({ 
        title: 'Niveau requis', 
        description: `Atteignez le niveau ${reward.unlockLevel} pour débloquer cette récompense.`,
        variant: 'destructive'
      });
      return;
    }

    setClaimedRewards(prev => [...prev, reward.id]);
    toast({
      title: 'Récompense récupérée ! 🎉',
      description: `Vous avez obtenu: ${reward.name}`,
    });
  };

  const isLocked = (reward: Reward) => {
    return reward.unlockLevel && userLevel < reward.unlockLevel;
  };

  const isClaimed = (reward: Reward) => {
    return claimedRewards.includes(reward.id);
  };

  const canAfford = (reward: Reward) => {
    return userPoints >= reward.points;
  };

  const nextLevelProgress = (userLevel % 1) * 100 || 65; // Simulé

  return (
    <div className="min-h-screen bg-background p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gift className="h-8 w-8 text-primary" />
            Récompenses
          </h1>
          <p className="text-muted-foreground">Échangez vos points contre des récompenses exclusives</p>
        </header>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Points disponibles</p>
                  <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Trophy className="h-7 w-7 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Niveau actuel</p>
                  <p className="text-3xl font-bold">{userLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Prochain niveau</p>
                <Badge variant="outline">Niveau {userLevel + 1}</Badge>
              </div>
              <Progress value={nextLevelProgress} className="h-3" />
              <p className="text-xs text-muted-foreground text-right">{nextLevelProgress}% complété</p>
            </CardContent>
          </Card>
        </div>

        {/* Rewards Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="themes">Thèmes</TabsTrigger>
            <TabsTrigger value="music">Musique</TabsTrigger>
            <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
            <TabsTrigger value="special">Spéciaux</TabsTrigger>
          </TabsList>

          {['all', 'themes', 'music', 'features', 'special'].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {rewards
                  .filter(r => tab === 'all' || r.category === tab)
                  .map((reward) => {
                    const Icon = reward.icon;
                    const locked = isLocked(reward);
                    const claimed = isClaimed(reward);
                    const affordable = canAfford(reward);

                    return (
                      <Card key={reward.id} className={`relative overflow-hidden ${rarityColors[reward.rarity]} ${locked ? 'opacity-60' : ''}`}>
                        {locked && (
                          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <div className="text-center">
                              <Lock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm font-medium">Niveau {reward.unlockLevel} requis</p>
                            </div>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-base">{reward.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{reward.description}</p>
                            <div className="flex gap-2">
                              <Badge className={rarityLabels[reward.rarity].color}>
                                {rarityLabels[reward.rarity].label}
                              </Badge>
                              <Badge variant="secondary">{reward.points} pts</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {claimed ? (
                            <Button disabled className="w-full" variant="outline">
                              ✓ Obtenu
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleClaim(reward)} 
                              className="w-full"
                              variant={affordable ? 'default' : 'outline'}
                              disabled={locked === true}
                            >
                              {affordable ? 'Récupérer' : `${reward.points - userPoints} pts manquants`}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
