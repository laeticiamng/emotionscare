/**
 * Page Profil Musical Utilisateur
 * Badges, statistiques, niveau, défis et mode social
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Share2,
  Trophy,
  Star,
  Music,
  Target,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { MusicBadgesDisplay } from '@/components/music/MusicBadgesDisplay';
import { DailyChallengesPanel } from '@/components/music/DailyChallengesPanel';
import { SocialFriendsPanel } from '@/components/music/SocialFriendsPanel';
import { useToast } from '@/hooks/use-toast';
import { getUserListeningHistory } from '@/services/music/user-service';
import { getUserMusicBadges } from '@/services/music/badges-service';

interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  totalListeningTime: number; // minutes
  totalTracks: number;
  joinedAt: string;
}

const MusicProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listeningHistory, setListeningHistory] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      // Mock profile data
      const profileData: UserProfile = {
        id: 'user-123',
        displayName: 'Music Lover',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MusicLover',
        level: 7,
        currentXP: 800,
        xpToNextLevel: 1000,
        totalXP: 3800,
        totalListeningTime: 1250,
        totalTracks: 342,
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      };

      const history = await getUserListeningHistory('user-123');
      const userBadges = await getUserMusicBadges('user-123');

      setProfile(profileData);
      setListeningHistory(history);
      setBadges(userBadges);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le profil',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `🎵 Niveau ${profile?.level} sur EmotionsCare Music !\n${badges.filter(b => b.unlocked).length} badges débloqués • ${profile?.totalTracks} pistes écoutées`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mon Profil Musical',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // Partage annulé
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copié !',
        description: 'Le texte a été copié dans le presse-papier'
      });
    }
  };

  const handleXPEarned = (xp: number) => {
    if (!profile) return;
    
    setProfile(prev => {
      if (!prev) return prev;
      const newCurrentXP = prev.currentXP + xp;
      const leveledUp = newCurrentXP >= prev.xpToNextLevel;
      
      if (leveledUp) {
        toast({
          title: '🎉 Niveau supérieur !',
          description: `Vous êtes maintenant niveau ${prev.level + 1}`
        });
        
        return {
          ...prev,
          level: prev.level + 1,
          currentXP: newCurrentXP - prev.xpToNextLevel,
          totalXP: prev.totalXP + xp
        };
      }
      
      return {
        ...prev,
        currentXP: newCurrentXP,
        totalXP: prev.totalXP + xp
      };
    });
  };

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const progressPercentage = (profile.currentXP / profile.xpToNextLevel) * 100;
  const unlockedBadges = badges.filter(b => b.unlocked).length;
  const memberDays = Math.floor((Date.now() - new Date(profile.joinedAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header avec retour */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/music')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la musique
      </Button>

      {/* Carte de profil */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {profile.displayName}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="default" className="text-lg">
                  <Trophy className="h-4 w-4 mr-1" />
                  Niveau {profile.level}
                </Badge>
                <Badge variant="secondary">
                  <Award className="h-4 w-4 mr-1" />
                  {unlockedBadges} badges
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Membre depuis {memberDays} jours
              </p>
            </div>
          </div>

          <Button onClick={handleShare} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>

        {/* Progression XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {profile.currentXP} / {profile.xpToNextLevel} XP
            </span>
            <span className="font-semibold text-foreground">
              {profile.xpToNextLevel - profile.currentXP} XP jusqu'au niveau {profile.level + 1}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <Music className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-3xl font-bold text-foreground">{profile.totalTracks}</p>
            <p className="text-sm text-muted-foreground">Pistes écoutées</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-secondary/10">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <p className="text-3xl font-bold text-foreground">{profile.totalListeningTime}min</p>
            <p className="text-sm text-muted-foreground">Temps d'écoute</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-accent/10">
            <Star className="h-8 w-8 mx-auto mb-2 text-accent" />
            <p className="text-3xl font-bold text-foreground">{profile.totalXP}</p>
            <p className="text-sm text-muted-foreground">XP Total</p>
          </Card>
        </motion.div>
      </div>

      {/* Tabs: Badges, Défis, Social */}
      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">
            <Target className="h-4 w-4 mr-2" />
            Défis
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Trophy className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="social">
            <Users className="h-4 w-4 mr-2" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <DailyChallengesPanel 
            userId={profile.id} 
            onXPEarned={handleXPEarned}
          />
        </TabsContent>

        <TabsContent value="badges">
          <MusicBadgesDisplay
            userId={profile.id}
            listeningHistory={listeningHistory}
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialFriendsPanel userId={profile.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MusicProfilePage;
