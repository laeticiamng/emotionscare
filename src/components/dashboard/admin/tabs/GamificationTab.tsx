
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award,
  Trophy,
  Medal,
  Zap,
  Download,
  Users,
  Smile,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { mockBadges, mockChallenges } from '@/hooks/community-gamification/mockData';

const GamificationTab: React.FC = () => {
  const totalUsers = 257;
  const activeUsers = 189;
  const engagementRate = Math.round((activeUsers / totalUsers) * 100);
  
  const badgeCompletionRate = 68;
  const challengeCompletionRate = 45;
  
  const topChallenges = mockChallenges
    .slice(0, 3)
    .map(challenge => ({
      name: challenge.name,
      completion: challenge.progress,
      points: challenge.points.toString()
    }));
  
  const topBadges = mockBadges
    .slice(0, 3)
    .map(badge => ({
      name: badge.name,
      earned: badge.earned || false,
      category: badge.category
    }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gamification</h2>
          <p className="text-muted-foreground">
            Gérez et analysez l'engagement des utilisateurs à travers les mécanismes de gamification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Zap className="mr-2 h-4 w-4" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.toString()}/{totalUsers.toString()}</div>
            <p className="text-xs text-muted-foreground">
              {engagementRate}% d'engagement
            </p>
            <Progress value={engagementRate} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Badges débloqués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badgeCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +12% depuis le mois dernier
            </p>
            <Progress value={badgeCompletionRate} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Défis complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challengeCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% depuis le mois dernier
            </p>
            <Progress value={challengeCompletionRate} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points distribués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500</div>
            <p className="text-xs text-muted-foreground">
              ~95 points par utilisateur
            </p>
            <div className="h-1 mt-2 bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{width: "80%"}}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Défis populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topChallenges.map((challenge, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{challenge.name}</p>
                        <Progress value={challenge.completion} className="h-2 mt-1 w-40" />
                      </div>
                      <span className="text-sm font-semibold">{challenge.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-sky-500" />
                  Badges populaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topBadges.map((badge, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.category}</p>
                      </div>
                      <span className={`text-sm ${badge.earned ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {badge.earned ? 'Populaire' : 'Émergent'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  Engagement par équipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Marketing</p>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Développement</p>
                      <span className="text-sm text-muted-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">Support</p>
                      <span className="text-sm text-muted-foreground">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="badges">
          <p>Contenu des badges...</p>
        </TabsContent>
        <TabsContent value="challenges">
          <p>Contenu des défis...</p>
        </TabsContent>
        <TabsContent value="rewards">
          <p>Contenu des récompenses...</p>
        </TabsContent>
        <TabsContent value="settings">
          <p>Paramètres de gamification...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationTab;
