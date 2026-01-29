/**
 * EntraidePage - Module Social Unifié
 * Consolide: Community, Groups, Buddies, Guilds, Social Cocon
 * 
 * Terminologie professionnelle pour soignants:
 * - "Cercles de Soutien" (ex Guilds)
 * - "Parrainage" (ex Buddies)
 * - "Groupes d'Entraide" (ex Community/Groups)
 * - "Espaces Calmes" (ex Social Cocon)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Heart, MessageCircle, Shield, Sparkles, 
  Search, Plus, UserPlus, Coffee, ArrowRight, Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PageRoot from '@/components/common/PageRoot';

interface SupportCircle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  specialty?: string;
  isPrivate: boolean;
}

interface MentoringMatch {
  id: string;
  partnerName: string;
  partnerAvatar?: string;
  compatibility: number;
  isOnline: boolean;
  lastMessage?: string;
}

interface CalmSpace {
  id: string;
  name: string;
  topic: string;
  participantCount: number;
  isActive: boolean;
}

const DEMO_CIRCLES: SupportCircle[] = [
  { id: '1', name: 'Équipe Urgences', description: 'Soutien pour les soignants des urgences', memberCount: 12, maxMembers: 20, specialty: 'Urgences', isPrivate: false },
  { id: '2', name: 'Infirmiers EHPAD', description: 'Entraide quotidienne en EHPAD', memberCount: 8, maxMembers: 15, specialty: 'Gériatrie', isPrivate: false },
  { id: '3', name: 'Aides-soignants solidaires', description: 'Groupe de soutien mutuel', memberCount: 15, maxMembers: 25, specialty: 'Polyvalent', isPrivate: false },
];

const DEMO_MENTORS: MentoringMatch[] = [
  { id: '1', partnerName: 'Marie L.', compatibility: 92, isOnline: true, lastMessage: 'Comment s\'est passée ta journée ?' },
  { id: '2', partnerName: 'Thomas B.', compatibility: 87, isOnline: false, lastMessage: 'On se retrouve demain matin ?' },
];

const DEMO_SPACES: CalmSpace[] = [
  { id: '1', name: 'Pause café virtuelle', topic: 'Décompression post-garde', participantCount: 3, isActive: true },
  { id: '2', name: 'Écoute bienveillante', topic: 'Moment de calme', participantCount: 2, isActive: true },
];

const EntraidePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalConnections: 5,
    activeCircles: 2,
    messagesUnread: 3,
    upcomingBreaks: 1
  };

  const handleJoinCircle = (circleId: string, circleName: string) => {
    toast({
      title: 'Cercle rejoint !',
      description: `Vous avez rejoint "${circleName}".`,
    });
  };

  const handleMessagePartner = (partnerId: string) => {
    toast({ title: 'Ouverture du chat...' });
  };

  const handleJoinSpace = (spaceId: string) => {
    navigate('/app/social-cocon');
  };

  return (
    <PageRoot>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Heart className="h-8 w-8 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Entraide & Soutien
                  </span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Prendre soin de celles et ceux qui prennent soin
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  {stats.messagesUnread > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {stats.messagesUnread}
                    </Badge>
                  )}
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Créer un espace
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalConnections}</div>
                <div className="text-sm text-muted-foreground">Connexions</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.activeCircles}</div>
                <div className="text-sm text-muted-foreground">Cercles actifs</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-accent-foreground">{stats.messagesUnread}</div>
                <div className="text-sm text-muted-foreground">Messages</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.upcomingBreaks}</div>
                <div className="text-sm text-muted-foreground">Pauses prévues</div>
              </Card>
            </div>
          </motion.header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="circles" className="gap-2">
                <Shield className="h-4 w-4" />
                Cercles de Soutien
              </TabsTrigger>
              <TabsTrigger value="mentoring" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Parrainage
              </TabsTrigger>
              <TabsTrigger value="calm-spaces" className="gap-2">
                <Coffee className="h-4 w-4" />
                Espaces Calmes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-primary" />
                      Mes Cercles
                    </CardTitle>
                    <CardDescription>Groupes d'entraide actifs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DEMO_CIRCLES.slice(0, 2).map(circle => (
                      <div key={circle.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium text-sm">{circle.name}</p>
                          <p className="text-xs text-muted-foreground">{circle.memberCount} membres</p>
                        </div>
                        <Badge variant="outline">{circle.specialty}</Badge>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab('circles')}>
                      Voir tous les cercles <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <UserPlus className="h-5 w-5 text-primary" />
                      Parrainage
                    </CardTitle>
                    <CardDescription>Vos partenaires de bien-être</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DEMO_MENTORS.map(mentor => (
                      <div 
                        key={mentor.id} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleMessagePartner(mentor.id)}
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold">
                            {mentor.partnerName.charAt(0)}
                          </div>
                          {mentor.isOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{mentor.partnerName}</p>
                          <p className="text-xs text-muted-foreground truncate">{mentor.lastMessage}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">{mentor.compatibility}%</Badge>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab('mentoring')}>
                      Trouver un parrain <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Coffee className="h-5 w-5 text-accent-foreground" />
                      Espaces Calmes
                    </CardTitle>
                    <CardDescription>Pauses partagées en cours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DEMO_SPACES.map(space => (
                      <div 
                        key={space.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                        onClick={() => handleJoinSpace(space.id)}
                      >
                        <div>
                          <p className="font-medium text-sm flex items-center gap-2">
                            {space.name}
                            {space.isActive && (
                              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{space.participantCount} participants</p>
                        </div>
                        <Button size="sm" variant="secondary">Rejoindre</Button>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-2" onClick={() => setActiveTab('calm-spaces')}>
                      Créer un espace <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">Suggestion du jour</h3>
                      <p className="text-muted-foreground mb-4">
                        Nous avons remarqué que vous n'avez pas pris de pause partagée cette semaine. 
                        Une courte pause avec un collègue peut aider à réduire le stress de 23%.
                      </p>
                      <div className="flex gap-3">
                        <Button>Planifier une pause</Button>
                        <Button variant="outline">Plus tard</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="circles" className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher par spécialité, nom..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un cercle
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEMO_CIRCLES.map(circle => (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{circle.name}</CardTitle>
                          {circle.specialty && (
                            <Badge variant="secondary">{circle.specialty}</Badge>
                          )}
                        </div>
                        <CardDescription>{circle.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{circle.memberCount}/{circle.maxMembers} membres</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handleJoinCircle(circle.id, circle.name)}
                          disabled={circle.memberCount >= circle.maxMembers}
                        >
                          {circle.memberCount >= circle.maxMembers ? 'Complet' : 'Rejoindre'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentoring" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Système de Parrainage</h2>
                    <p className="text-muted-foreground">
                      Trouvez un partenaire de bien-être compatible avec votre profil
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DEMO_MENTORS.map(mentor => (
                    <Card key={mentor.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-xl font-semibold">
                            {mentor.partnerName.charAt(0)}
                          </div>
                          {mentor.isOnline && (
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-accent rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{mentor.partnerName}</h3>
                          <p className="text-sm text-muted-foreground">Compatibilité: {mentor.compatibility}%</p>
                          <p className="text-xs text-muted-foreground mt-1">{mentor.lastMessage}</p>
                        </div>
                        <Button size="sm" onClick={() => handleMessagePartner(mentor.id)}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline" onClick={() => navigate('/app/buddies')}>
                    Découvrir plus de partenaires
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="calm-spaces" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 rounded-full bg-accent">
                    <Coffee className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Espaces Calmes</h2>
                    <p className="text-muted-foreground">
                      Des moments de pause partagée en toute confidentialité
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {DEMO_SPACES.map(space => (
                    <Card key={space.id} className="p-4 border-dashed">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {space.name}
                            {space.isActive && (
                              <Badge variant="outline" className="text-accent-foreground border-accent">
                                En cours
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{space.topic}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {space.participantCount} participants
                          </p>
                        </div>
                        <Button onClick={() => handleJoinSpace(space.id)}>
                          Rejoindre
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button onClick={() => navigate('/app/social-cocon')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un espace calme
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageRoot>
  );
};

export default EntraidePage;
