// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Clock, Target, Share2, Zap, Flame, Star, 
  Bell, BellOff, Users, Medal, Info, Bookmark, MoreVertical, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
  bonusMultiplier?: number;
  streak?: number;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: (challengeId: string) => void;
  onClaim?: (challengeId: string) => void;
}

// Mock data pour les amis qui font le même défi
const mockFriendsOnChallenge = [
  { id: '1', name: 'Marie', avatar: '', progress: 75 },
  { id: '2', name: 'Pierre', avatar: '', progress: 50 },
  { id: '3', name: 'Sophie', avatar: '', progress: 100 },
];

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onStart, 
  onClaim 
}) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    const saved = localStorage.getItem('challengeFavorites');
    return saved ? JSON.parse(saved).includes(challenge.id) : false;
  });
  const [hasReminder, setHasReminder] = useState(() => {
    const saved = localStorage.getItem('challengeReminders');
    return saved ? JSON.parse(saved).includes(challenge.id) : false;
  });
  const [showDetails, setShowDetails] = useState(false);
  const [showFriends, setShowFriends] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!challenge.deadline) return;

    const updateTimer = () => {
      const now = new Date();
      const deadline = new Date(challenge.deadline!);
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Expiré');
        setIsUrgent(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours < 24) {
        setIsUrgent(true);
        if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${minutes}m`);
        }
      } else {
        const days = Math.floor(hours / 24);
        setTimeRemaining(`${days}j ${hours % 24}h`);
        setIsUrgent(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [challenge.deadline]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'moyen': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'difficile': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'special': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'special': return 'Spécial';
      default: return category;
    }
  };

  const isCompleted = challenge.progress >= challenge.maxProgress;
  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;
  const totalPoints = challenge.bonusMultiplier 
    ? Math.round(challenge.points * challenge.bonusMultiplier) 
    : challenge.points;

  const toggleFavorite = () => {
    const saved = localStorage.getItem('challengeFavorites');
    const favorites: string[] = saved ? JSON.parse(saved) : [];
    
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== challenge.id);
      localStorage.setItem('challengeFavorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({ title: 'Retiré des favoris' });
    } else {
      favorites.push(challenge.id);
      localStorage.setItem('challengeFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({ title: 'Ajouté aux favoris', description: 'Retrouvez ce défi facilement' });
    }
  };

  const toggleReminder = () => {
    const saved = localStorage.getItem('challengeReminders');
    const reminders: string[] = saved ? JSON.parse(saved) : [];
    
    if (hasReminder) {
      const newReminders = reminders.filter(id => id !== challenge.id);
      localStorage.setItem('challengeReminders', JSON.stringify(newReminders));
      setHasReminder(false);
      toast({ title: 'Rappel désactivé' });
    } else {
      reminders.push(challenge.id);
      localStorage.setItem('challengeReminders', JSON.stringify(reminders));
      setHasReminder(true);
      toast({ title: 'Rappel activé', description: 'Vous serez notifié avant l\'expiration' });
    }
  };

  const handleShare = async () => {
    const shareText = `🏆 Je relève le défi "${challenge.title}" sur EmotionsCare ! ${challenge.completed ? '✅ Terminé !' : `${Math.round(progressPercentage)}% complété`}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mon défi EmotionsCare', text: shareText });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !', description: 'Le texte a été copié dans le presse-papier.' });
    }
  };

  // Amis sur le même défi
  const friendsOnChallenge = mockFriendsOnChallenge;
  const friendsCompleted = friendsOnChallenge.filter(f => f.progress >= 100).length;

  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`hover:shadow-lg transition-all duration-200 overflow-hidden ${
          isCompleted && !challenge.completed ? 'ring-2 ring-green-500/50' : ''
        } ${isFavorite ? 'ring-2 ring-amber-400/30' : ''}`}>
          {/* Bonus Multiplier Banner */}
          {challenge.bonusMultiplier && challenge.bonusMultiplier > 1 && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs py-1 px-3 flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              <span className="font-semibold">Bonus x{challenge.bonusMultiplier} actif !</span>
            </div>
          )}

          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    {isFavorite && (
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    )}
                    {challenge.streak && challenge.streak > 1 && (
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-0.5 text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded-full">
                            <Flame className="h-3 w-3" />
                            <span className="text-xs font-bold">{challenge.streak}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Série de {challenge.streak} défis complétés !</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>
                
                {/* Points & Menu */}
                <div className="flex items-start gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-full">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold text-sm">{totalPoints}</span>
                    </div>
                    {challenge.bonusMultiplier && challenge.bonusMultiplier > 1 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {challenge.points}
                      </span>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={toggleFavorite}>
                        <Star className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                        {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleReminder}>
                        {hasReminder ? <BellOff className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                        {hasReminder ? 'Désactiver rappel' : 'Activer rappel'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDetails(true)}>
                        <Info className="h-4 w-4 mr-2" />
                        Détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                  {challenge.difficulty}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getCategoryIcon(challenge.category)}
                  {getCategoryLabel(challenge.category)}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white">
                    ✓ Terminé
                  </Badge>
                )}
                {hasReminder && (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                    <Bell className="h-3 w-3 mr-1" />
                    Rappel
                  </Badge>
                )}
              </div>

              {/* Amis sur le même défi */}
              {friendsOnChallenge.length > 0 && (
                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setShowFriends(true)}
                >
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {friendsOnChallenge.slice(0, 3).map((friend) => (
                      <Avatar key={friend.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{friend.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {friendsCompleted}/{friendsOnChallenge.length} amis ont terminé
                  </span>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {challenge.progress}/{challenge.maxProgress}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="absolute inset-0 flex justify-between items-center px-1">
                    {[25, 50, 75].map((milestone) => (
                      <div
                        key={milestone}
                        className={`w-1 h-1 rounded-full ${
                          progressPercentage >= milestone ? 'bg-white' : 'bg-white/30'
                        }`}
                        style={{ marginLeft: `${milestone - 2}%` }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  {Math.round(progressPercentage)}% complété
                </p>
              </div>

              {/* Deadline with countdown */}
              {challenge.deadline && (
                <div className={`flex items-center gap-2 text-sm p-2 rounded-lg ${
                  isUrgent ? 'bg-red-500/10 text-red-600' : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <Clock className={`h-4 w-4 ${isUrgent ? 'animate-pulse' : ''}`} />
                  <span>
                    {isUrgent ? 'Plus que ' : 'Échéance: '}
                    <span className="font-semibold">{timeRemaining}</span>
                  </span>
                  {isUrgent && !isCompleted && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <div className="flex-1">
                  {isCompleted && !challenge.completed ? (
                    <Button 
                      onClick={() => onClaim?.(challenge.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      Réclamer {totalPoints} pts
                    </Button>
                  ) : challenge.completed ? (
                    <Button variant="outline" disabled className="w-full">
                      ✓ Récompense réclamée
                    </Button>
                  ) : challenge.progress > 0 ? (
                    <Button 
                      onClick={() => onStart?.(challenge.id)}
                      variant="outline" 
                      className="w-full"
                    >
                      Continuer ({Math.round(progressPercentage)}%)
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => onStart?.(challenge.id)}
                      className="w-full"
                    >
                      Commencer
                    </Button>
                  )}
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Partager ce défi</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialog détails */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {challenge.title}
            </DialogTitle>
            <DialogDescription>{challenge.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-2xl font-bold">{Math.round(progressPercentage)}%</p>
                <p className="text-xs text-muted-foreground">Progression</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Catégorie</span>
                <span className="font-medium">{getCategoryLabel(challenge.category)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Difficulté</span>
                <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                  {challenge.difficulty}
                </Badge>
              </div>
              {challenge.deadline && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Échéance</span>
                  <span className="font-medium">{timeRemaining}</span>
                </div>
              )}
              {challenge.streak && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Série actuelle</span>
                  <span className="font-medium flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {challenge.streak}
                  </span>
                </div>
              )}
            </div>

            <Progress value={progressPercentage} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              {challenge.progress} / {challenge.maxProgress} accompli
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog amis */}
      <Dialog open={showFriends} onOpenChange={setShowFriends}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Amis sur ce défi
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {friendsOnChallenge.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <Avatar>
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{friend.name}</p>
                  <Progress value={friend.progress} className="h-1.5 mt-1" />
                </div>
                <span className="text-sm text-muted-foreground">{friend.progress}%</span>
                {friend.progress >= 100 && (
                  <Medal className="h-4 w-4 text-amber-500" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default ChallengeCard;
