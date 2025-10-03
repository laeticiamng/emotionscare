import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, 
  Star, 
  Crown, 
  Zap,
  Heart,
  Brain,
  Users,
  Target,
  Calendar,
  Trophy,
  Lock,
  Unlock,
  Sparkles,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  category: 'emotional' | 'social' | 'achievement' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  color: string;
  background: string;
  conditions: {
    type: 'count' | 'streak' | 'time' | 'special';
    target: number;
    description: string;
  }[];
  rewards: {
    xp: number;
    title?: string;
    unlock?: string;
  };
  isHidden?: boolean;
}

interface UserBadge extends BadgeDefinition {
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

const badgeDefinitions: BadgeDefinition[] = [
  // Badges Émotionnels
  {
    id: 'first-scan',
    name: 'Premier Scan',
    description: 'Effectuez votre premier scan émotionnel',
    category: 'emotional',
    rarity: 'common',
    icon: '🎯',
    color: 'text-blue-600',
    background: 'from-blue-100 to-blue-200',
    conditions: [{ type: 'count', target: 1, description: 'Effectuer 1 scan émotionnel' }],
    rewards: { xp: 50 }
  },
  {
    id: 'emotion-explorer',
    name: 'Explorateur Émotionnel',
    description: 'Identifiez 50 émotions différentes',
    category: 'emotional',
    rarity: 'rare',
    icon: '🗺️',
    color: 'text-purple-600',
    background: 'from-purple-100 to-purple-200',
    conditions: [{ type: 'count', target: 50, description: 'Identifier 50 émotions uniques' }],
    rewards: { xp: 250, title: 'Explorateur' }
  },
  {
    id: 'emotion-master',
    name: 'Maître des Émotions',
    description: 'Atteignez 95% de précision dans l\'identification émotionnelle',
    category: 'emotional',
    rarity: 'epic',
    icon: '🧘',
    color: 'text-indigo-600',
    background: 'from-indigo-100 to-indigo-200',
    conditions: [{ type: 'special', target: 95, description: '95% de précision moyenne' }],
    rewards: { xp: 500, unlock: 'Mode Expert' }
  },

  // Badges Sociaux
  {
    id: 'social-butterfly',
    name: 'Papillon Social',
    description: 'Interagissez avec 25 membres différents',
    category: 'social',
    rarity: 'rare',
    icon: '🦋',
    color: 'text-pink-600',
    background: 'from-pink-100 to-pink-200',
    conditions: [{ type: 'count', target: 25, description: 'Interagir avec 25 membres uniques' }],
    rewards: { xp: 300 }
  },
  {
    id: 'community-leader',
    name: 'Leader Communautaire',
    description: 'Recevez 100 likes sur vos publications',
    category: 'social',
    rarity: 'epic',
    icon: '👑',
    color: 'text-yellow-600',
    background: 'from-yellow-100 to-yellow-200',
    conditions: [{ type: 'count', target: 100, description: 'Recevoir 100 likes au total' }],
    rewards: { xp: 400, title: 'Leader' }
  },

  // Badges de Série
  {
    id: 'week-warrior',
    name: 'Guerrier Hebdomadaire',
    description: 'Maintenez une série de 7 jours',
    category: 'streak',
    rarity: 'common',
    icon: '🔥',
    color: 'text-orange-600',
    background: 'from-orange-100 to-orange-200',
    conditions: [{ type: 'streak', target: 7, description: 'Série de 7 jours consécutifs' }],
    rewards: { xp: 200 }
  },
  {
    id: 'month-champion',
    name: 'Champion Mensuel',
    description: 'Maintenez une série de 30 jours',
    category: 'streak',
    rarity: 'epic',
    icon: '🏆',
    color: 'text-red-600',
    background: 'from-red-100 to-red-200',
    conditions: [{ type: 'streak', target: 30, description: 'Série de 30 jours consécutifs' }],
    rewards: { xp: 1000, title: 'Champion' }
  },
  {
    id: 'year-legend',
    name: 'Légende Annuelle',
    description: 'Maintenez une série de 365 jours',
    category: 'streak',
    rarity: 'legendary',
    icon: '⭐',
    color: 'text-gradient-to-r from-yellow-400 to-orange-500',
    background: 'from-yellow-100 via-orange-100 to-red-100',
    conditions: [{ type: 'streak', target: 365, description: 'Série de 365 jours consécutifs' }],
    rewards: { xp: 5000, title: 'Légende', unlock: 'Statut VIP' }
  },

  // Badges Spéciaux
  {
    id: 'night-owl',
    name: 'Oiseau de Nuit',
    description: 'Effectuez 10 scans entre 22h et 6h',
    category: 'special',
    rarity: 'rare',
    icon: '🦉',
    color: 'text-indigo-600',
    background: 'from-indigo-100 to-purple-100',
    conditions: [{ type: 'special', target: 10, description: '10 scans nocturnes (22h-6h)' }],
    rewards: { xp: 300 },
    isHidden: true
  },
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Complétez 50 défis avec un score parfait',
    category: 'achievement',
    rarity: 'legendary',
    icon: '💎',
    color: 'text-cyan-600',
    background: 'from-cyan-100 to-blue-100',
    conditions: [{ type: 'special', target: 50, description: '50 défis avec score parfait' }],
    rewards: { xp: 2000, title: 'Perfectionniste' },
    isHidden: true
  },
  {
    id: 'time-traveler',
    name: 'Voyageur Temporel',
    description: 'Utilisez l\'app pendant plus d\'un an',
    category: 'special',
    rarity: 'mythic',
    icon: '⏰',
    color: 'text-gradient-to-r from-purple-500 to-pink-500',
    background: 'from-purple-100 via-pink-100 to-purple-100',
    conditions: [{ type: 'time', target: 365, description: '365 jours d\'utilisation' }],
    rewards: { xp: 10000, title: 'Voyageur Temporel', unlock: 'Fonctionnalités Exclusives' },
    isHidden: true
  }
];

const rarityStyles = {
  common: {
    border: 'border-gray-300',
    glow: 'shadow-gray-200',
    sparkles: ['#9CA3AF', '#6B7280']
  },
  rare: {
    border: 'border-blue-400',
    glow: 'shadow-blue-200',
    sparkles: ['#3B82F6', '#1D4ED8']
  },
  epic: {
    border: 'border-purple-400',
    glow: 'shadow-purple-200',
    sparkles: ['#8B5CF6', '#7C3AED']
  },
  legendary: {
    border: 'border-yellow-400',
    glow: 'shadow-yellow-200',
    sparkles: ['#F59E0B', '#D97706']
  },
  mythic: {
    border: 'border-gradient-to-r from-purple-400 to-pink-400',
    glow: 'shadow-purple-300',
    sparkles: ['#EC4899', '#8B5CF6', '#F59E0B']
  }
};

export const PremiumBadgeSystem: React.FC = () => {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnlockedAnimation, setShowUnlockedAnimation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBadges();
  }, []);

  const loadUserBadges = async () => {
    setLoading(true);
    try {
      // Simuler le chargement depuis l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userBadges: UserBadge[] = badgeDefinitions.map(badge => ({
        ...badge,
        unlocked: Math.random() > 0.7, // 30% de chance d'être débloqué
        unlockedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined,
        progress: Math.floor(Math.random() * badge.conditions[0].target),
        maxProgress: badge.conditions[0].target
      }));

      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeUnlock = (badgeId: string) => {
    setBadges(prev => 
      prev.map(badge => 
        badge.id === badgeId 
          ? { 
              ...badge, 
              unlocked: true, 
              unlockedAt: new Date().toISOString(),
              progress: badge.maxProgress 
            }
          : badge
      )
    );

    const badge = badges.find(b => b.id === badgeId);
    if (badge) {
      setShowUnlockedAnimation(badgeId);
      
      // Animation confetti avec couleurs du badge
      const colors = rarityStyles[badge.rarity].sparkles;
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: colors
      });

      setTimeout(() => {
        setShowUnlockedAnimation(null);
      }, 3000);
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory === 'all') return !badge.isHidden || badge.unlocked;
    if (selectedCategory === 'unlocked') return badge.unlocked;
    if (selectedCategory === 'locked') return !badge.unlocked && (!badge.isHidden || badge.progress > 0);
    return badge.category === selectedCategory && (!badge.isHidden || badge.unlocked);
  });

  const categories = [
    { id: 'all', name: 'Tous', icon: Award },
    { id: 'unlocked', name: 'Débloqués', icon: Unlock },
    { id: 'locked', name: 'Verrouillés', icon: Lock },
    { id: 'emotional', name: 'Émotionnel', icon: Heart },
    { id: 'social', name: 'Social', icon: Users },
    { id: 'streak', name: 'Série', icon: Flame },
    { id: 'achievement', name: 'Succès', icon: Target },
    { id: 'special', name: 'Spécial', icon: Sparkles }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Animation Badge Débloqué */}
      <AnimatePresence>
        {showUnlockedAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="bg-background rounded-lg p-8 max-w-md mx-4 text-center"
            >
              {(() => {
                const badge = badges.find(b => b.id === showUnlockedAnimation);
                if (!badge) return null;
                
                return (
                  <>
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 2 }}
                      className={`mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br ${badge.background} 
                        flex items-center justify-center text-4xl border-4 ${rarityStyles[badge.rarity].border}
                        ${rarityStyles[badge.rarity].glow} shadow-lg`}
                    >
                      {badge.icon}
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold mb-2">Badge Débloqué!</h2>
                    <h3 className="text-xl text-primary mb-2">{badge.name}</h3>
                    <p className="text-muted-foreground mb-4">{badge.description}</p>
                    
                    <Badge variant="outline" className="mb-4">
                      {badge.rarity} • +{badge.rewards.xp} XP
                    </Badge>
                    
                    <Button onClick={() => setShowUnlockedAnimation(null)}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Fantastique!
                    </Button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Collection de Badges</h2>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            {badges.filter(b => b.unlocked).length}/{badges.filter(b => !b.isHidden || b.unlocked).length}
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 w-full">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBadges.map((badge) => {
              const progressPercentage = (badge.progress / badge.maxProgress) * 100;
              const rarity = rarityStyles[badge.rarity];
              
              return (
                <motion.div
                  key={badge.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative overflow-hidden group ${badge.unlocked ? 'transform hover:scale-105' : ''}`}
                >
                  <Card className={`h-full transition-all duration-300 ${rarity.border} ${
                    badge.unlocked ? `${rarity.glow} shadow-lg` : 'opacity-60'
                  }`}>
                    {badge.unlocked && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                    )}
                    
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${badge.background} 
                        flex items-center justify-center text-3xl border-2 ${rarity.border}
                        ${badge.unlocked ? rarity.glow : ''} shadow-md relative`}>
                        
                        {badge.unlocked && badge.rarity === 'legendary' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400"
                          />
                        )}
                        
                        {badge.unlocked && badge.rarity === 'mythic' && (
                          <>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                            />
                            <motion.div
                              animate={{ rotate: -360 }}
                              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 rounded-full border border-gradient-to-r from-purple-400 to-pink-400"
                            />
                          </>
                        )}
                        
                        <span className={badge.unlocked ? '' : 'grayscale'}>{badge.icon}</span>
                        
                        {!badge.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <Lock className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-lg">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Badge 
                          variant={badge.unlocked ? "default" : "outline"}
                          className={badge.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 
                                    badge.rarity === 'mythic' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
                        >
                          {badge.rarity}
                        </Badge>
                        <Badge variant="secondary">
                          +{badge.rewards.xp} XP
                        </Badge>
                      </div>

                      {!badge.unlocked && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progression</span>
                            <span>{badge.progress}/{badge.maxProgress}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {badge.conditions[0].description}
                          </p>
                        </div>
                      )}

                      {badge.unlocked && badge.unlockedAt && (
                        <p className="text-xs text-muted-foreground">
                          Débloqué le {new Date(badge.unlockedAt).toLocaleDateString()}
                        </p>
                      )}

                      {badge.rewards.title && badge.unlocked && (
                        <Badge variant="outline" className="bg-primary/10">
                          Titre: {badge.rewards.title}
                        </Badge>
                      )}

                      {badge.rewards.unlock && badge.unlocked && (
                        <Badge variant="outline" className="bg-green-50">
                          Débloque: {badge.rewards.unlock}
                        </Badge>
                      )}

                      {/* Bouton de test pour débloquer (dev seulement) */}
                      {!badge.unlocked && process.env.NODE_ENV === 'development' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBadgeUnlock(badge.id)}
                        >
                          Débloquer (Dev)
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <Card className="p-8 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun badge dans cette catégorie</h3>
              <p className="text-muted-foreground">
                Continuez à utiliser l'application pour débloquer de nouveaux badges
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumBadgeSystem;