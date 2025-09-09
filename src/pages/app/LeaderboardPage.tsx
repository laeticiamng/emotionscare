import React, { useState, useEffect } from 'react';
import { Trophy, Star, Heart, Target, Zap, Crown, Award, Users, Filter, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CommunityMember {
  id: string;
  username: string;
  badges: CommunityBadge[];
  joinedAt: Date;
  lastActive: Date;
  inspirationalMessage?: string;
  avatar: string;
  level: number;
}

interface CommunityBadge {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
}

const LeaderboardPage = () => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [filterBadge, setFilterBadge] = useState('tous');
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<CommunityBadge | null>(null);
  const [currentUser] = useState({
    id: 'current-user',
    username: 'Vous',
    badges: [] as CommunityBadge[]
  });

  const availableBadges = {
    explorateur: {
      id: 'explorateur',
      name: 'Explorateur',
      description: 'A découvert plusieurs modules',
      icon: Target,
      color: 'bg-blue-500',
      rarity: 'common' as const
    },
    solidaire: {
      id: 'solidaire', 
      name: 'Solidaire',
      description: 'Partage positivement avec la communauté',
      icon: Heart,
      color: 'bg-pink-500',
      rarity: 'rare' as const
    },
    perseverant: {
      id: 'perseverant',
      name: 'Persévérant',
      description: 'Pratique régulière et constante',
      icon: Star,
      color: 'bg-yellow-500',
      rarity: 'epic' as const
    },
    mentor: {
      id: 'mentor',
      name: 'Mentor',
      description: 'Guide et inspire les autres',
      icon: Crown,
      color: 'bg-purple-500',
      rarity: 'legendary' as const
    },
    zenitude: {
      id: 'zenitude',
      name: 'Zénitude',
      description: 'Maîtrise des pratiques de bien-être',
      icon: Zap,
      color: 'bg-green-500',
      rarity: 'epic' as const
    },
    pionnier: {
      id: 'pionnier',
      name: 'Pionnier',
      description: 'Parmi les premiers utilisateurs',
      icon: Trophy,
      color: 'bg-orange-500',
      rarity: 'rare' as const
    }
  };

  // Génération de la communauté avec modération
  useEffect(() => {
    const generateCommunity = () => {
      const inspirationalMessages = [
        "La régularité transforme les petits gestes en grandes victoires ✨",
        "Chaque respiration consciente nous rapproche de notre équilibre 🌸",
        "Le voyage vers le bien-être n'a pas de destination, juste des moments présents 🌱",
        "Votre pratique inspire les autres, continuez à briller 🌟",
        "Dans la simplicité se trouve la vraie sérénité 🕊️",
        "Merci d'être une source de positivité pour notre communauté 💫",
        "L'authenticité de votre partage nous touche tous 🤗",
        "Ensemble nous grandissons, ensemble nous nous épanouissons 🌻"
      ];

      const usernames = [
        'Marie_Zen', 'Lucas_Flow', 'Emma_Breathe', 'Tom_Mindful', 'Lea_Harmony',
        'Alex_Peace', 'Julie_Calm', 'Paul_Serenity', 'Nina_Bright', 'Sam_Focus',
        'Lou_Balance', 'Max_Glow', 'Lisa_Quiet', 'Ben_Soft', 'Ana_Light'
      ];

      const generatedMembers: CommunityMember[] = usernames.map((username, index) => {
        const joinDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        const lastActiveOffset = Math.random() * 7 * 24 * 60 * 60 * 1000;
        
        // Attribuer badges aléatoirement mais cohérent
        const memberBadges: CommunityBadge[] = [];
        const badgeKeys = Object.keys(availableBadges);
        const numBadges = Math.floor(Math.random() * 4) + 1; // 1-4 badges
        
        for (let i = 0; i < numBadges; i++) {
          const badgeKey = badgeKeys[Math.floor(Math.random() * badgeKeys.length)];
          const badge = availableBadges[badgeKey as keyof typeof availableBadges];
          
          if (!memberBadges.find(b => b.id === badge.id)) {
            memberBadges.push({
              ...badge,
              unlockedAt: new Date(joinDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
            });
          }
        }

        return {
          id: `member-${index}`,
          username,
          badges: memberBadges,
          joinedAt: joinDate,
          lastActive: new Date(Date.now() - lastActiveOffset),
          inspirationalMessage: Math.random() > 0.4 ? inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)] : undefined,
          avatar: username.charAt(0),
          level: Math.floor(Math.random() * 20) + 1
        };
      });

      // Trier par nombre de badges puis par ancienneté
      return generatedMembers.sort((a, b) => {
        const badgeDiff = b.badges.length - a.badges.length;
        if (badgeDiff !== 0) return badgeDiff;
        return a.joinedAt.getTime() - b.joinedAt.getTime();
      });
    };

    setMembers(generateCommunity());

    // Simuler déblocage d'un badge pour l'utilisateur actuel
    const simulateNewBadge = () => {
      if (Math.random() > 0.7) {
        const randomBadge = Object.values(availableBadges)[Math.floor(Math.random() * Object.keys(availableBadges).length)];
        setNewBadgeUnlocked({
          ...randomBadge,
          unlockedAt: new Date()
        });
        
        setTimeout(() => {
          toast.success(`🏆 Nouveau badge : ${randomBadge.name}`, {
            description: randomBadge.description,
            duration: 4000
          });
        }, 1000);

        setTimeout(() => setNewBadgeUnlocked(null), 5000);
      }
    };

    const timer = setTimeout(simulateNewBadge, 2000);
    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = filterBadge === 'tous' 
    ? members 
    : members.filter(member => member.badges.some(badge => badge.id === filterBadge));

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 bg-yellow-500/10';
      case 'epic': return 'border-purple-400 bg-purple-500/10';
      case 'rare': return 'border-blue-400 bg-blue-500/10';
      default: return 'border-gray-400 bg-gray-500/10';
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return 'Actif maintenant';
    if (diffHours < 24) return `Actif il y a ${diffHours}h`;
    if (diffDays === 1) return 'Actif hier';
    if (diffDays < 7) return `Actif il y a ${diffDays} jours`;
    return 'Inactif cette semaine';
  };

  const refreshCommunity = () => {
    toast.info('Actualisation de la communauté', {
      duration: 1000
    });
    // Mélanger l'ordre
    setMembers(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Leaderboard Verbal
          </h1>
          <p className="text-muted-foreground">
            Célébrons ensemble nos parcours de bien-être
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4" />
              {members.length} membres actifs
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Award className="w-4 h-4" />
              {Object.keys(availableBadges).length} badges disponibles
            </span>
          </div>
        </motion.div>

        {/* Badge récemment débloqué */}
        <AnimatePresence>
          {newBadgeUnlocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: -100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: -100 }}
              className="fixed top-4 right-4 z-50"
            >
              <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-2xl">
                <div className="text-center space-y-2">
                  <newBadgeUnlocked.icon className="w-8 h-8 mx-auto" />
                  <div className="font-bold">Nouveau badge !</div>
                  <div className="text-sm">{newBadgeUnlocked.name}</div>
                  <div className="text-xs opacity-90">{newBadgeUnlocked.description}</div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* Filtres */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-muted">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtrer par badge
                </h3>
                
                <Select value={filterBadge} onValueChange={setFilterBadge}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les badges</SelectItem>
                    {Object.entries(availableBadges).map(([key, badge]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <badge.icon className="w-3 h-3" />
                          {badge.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={refreshCommunity} variant="outline" size="sm" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </Card>

            {/* Votre profil */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4 text-primary" />
                Votre profil
              </h3>
              <div className="text-center space-y-3">
                <Avatar className="w-16 h-16 mx-auto">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    V
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{currentUser.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {newBadgeUnlocked ? 
                      `${currentUser.badges.length + 1} badge${currentUser.badges.length + 1 > 1 ? 's' : ''}` :
                      `${currentUser.badges.length} badge${currentUser.badges.length > 1 ? 's' : ''}`
                    }
                  </div>
                </div>
                {newBadgeUnlocked && (
                  <Badge className="bg-yellow-500 text-white">
                    Nouveau badge débloqué ! 🎉
                  </Badge>
                )}
              </div>
            </Card>

            {/* Guide des badges */}
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-muted">
              <h3 className="font-semibold mb-3">Guide des badges</h3>
              <div className="space-y-2">
                {Object.entries(availableBadges).map(([key, badge]) => {
                  const Icon = badge.icon;
                  return (
                    <div key={key} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className={`w-6 h-6 rounded-full ${badge.color} flex items-center justify-center`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{badge.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{badge.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Communauté principale */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Communauté inspirante</h2>
                <Badge variant="outline">
                  {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''}
                </Badge>
              </div>

              {filteredMembers.length === 0 ? (
                <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-muted">
                  <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun membre trouvé</h3>
                  <p className="text-muted-foreground">
                    Essayez de modifier le filtre pour voir d'autres membres de la communauté.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {filteredMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-6 bg-card/30 backdrop-blur-sm border-muted hover:border-muted/80 transition-colors">
                          <div className="flex gap-4">
                            <Avatar className="w-12 h-12 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold">
                                {member.avatar}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-3">
                              {/* Informations utilisateur */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{member.username}</h3>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span>{formatLastActive(member.lastActive)}</span>
                                    <span>•</span>
                                    <span>Depuis {member.joinedAt.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</span>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <div className="text-sm font-medium text-primary">
                                    Niveau {member.level}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {member.badges.length} badge{member.badges.length > 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>

                              {/* Badges */}
                              <div className="flex gap-2 flex-wrap">
                                {member.badges.map((badge) => {
                                  const Icon = badge.icon;
                                  return (
                                    <div
                                      key={badge.id}
                                      className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getBadgeRarityColor(badge.rarity)}`}
                                      title={badge.description}
                                    >
                                      <Icon className="w-3 h-3" />
                                      <span className="text-xs font-medium">{badge.name}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Message inspirant */}
                              {member.inspirationalMessage && (
                                <div className="bg-muted/30 p-3 rounded-lg border border-muted/50">
                                  <p className="text-sm italic text-muted-foreground">
                                    "{member.inspirationalMessage}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Note importante */}
              <Card className="p-6 bg-card/20 backdrop-blur-sm border-muted/50">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Communauté bienveillante</p>
                    <p>
                      Ici, pas de compétition ni de classement chiffré. Nous célébrons simplement 
                      nos parcours individuels et partageons l'inspiration. Chaque badge représente 
                      un accomplissement personnel unique.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;