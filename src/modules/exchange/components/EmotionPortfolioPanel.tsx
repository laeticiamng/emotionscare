/**
 * Emotion Portfolio Panel - Display and activate emotions from portfolio
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Play, 
  Sparkles, 
  Zap, 
  Sun, 
  Brain, 
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEmotionPortfolio, useUseEmotionAsset, useEmotionAssets } from '../hooks/useExchangeData';
import type { EmotionType, EmotionPortfolio } from '../types';
import { toast } from 'sonner';

const emotionIcons = {
  calm: Heart,
  focus: Brain,
  energy: Zap,
  joy: Sun,
  creativity: Sparkles,
  confidence: Shield,
} as const;

const emotionColors: Record<EmotionType, string> = {
  calm: 'from-blue-400 to-cyan-500',
  focus: 'from-purple-400 to-indigo-500',
  energy: 'from-orange-400 to-red-500',
  joy: 'from-yellow-400 to-amber-500',
  creativity: 'from-emerald-400 to-teal-500',
  confidence: 'from-rose-400 to-pink-500',
};

const emotionLabels: Record<EmotionType, string> = {
  calm: 'Calme',
  focus: 'Focus',
  energy: 'Énergie',
  joy: 'Joie',
  creativity: 'Créativité',
  confidence: 'Confiance',
};

interface EmotionPortfolioPanelProps {
  compact?: boolean;
}

export const EmotionPortfolioPanel: React.FC<EmotionPortfolioPanelProps> = ({ 
  compact = false 
}) => {
  const { data: portfolio, isLoading } = useEmotionPortfolio();
  const { data: assets } = useEmotionAssets();
  const useAsset = useUseEmotionAsset();
  const [activatingEmotion, setActivatingEmotion] = React.useState<EmotionPortfolio | null>(null);
  const [isActivating, setIsActivating] = React.useState(false);

  const handleActivate = async (item: EmotionPortfolio) => {
    setIsActivating(true);
    try {
      await useAsset.mutateAsync({
        portfolioId: item.id,
        assetId: item.asset_id,
      });
      
      const asset = assets?.find(a => a.id === item.asset_id);
      toast.success(`${asset?.name || 'Émotion'} activée !`, {
        description: 'Profitez de votre expérience émotionnelle.',
        duration: 5000,
      });
      setActivatingEmotion(null);
    } catch (error) {
      toast.error('Erreur lors de l\'activation');
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-32" />
      </Card>
    );
  }

  if (!portfolio || portfolio.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h4 className="font-medium mb-1">Portfolio vide</h4>
          <p className="text-sm text-muted-foreground">
            Achetez des émotions sur le marché pour les utiliser ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by emotion type and calculate totals
  const groupedPortfolio = portfolio.reduce((acc, item) => {
    const asset = assets?.find(a => a.id === item.asset_id);
    if (!asset) return acc;

    const key = asset.emotion_type;
    if (!acc[key]) {
      acc[key] = {
        items: [],
        totalQuantity: 0,
        asset,
      };
    }
    acc[key].items.push(item);
    acc[key].totalQuantity += item.quantity;
    return acc;
  }, {} as Record<string, { items: EmotionPortfolio[]; totalQuantity: number; asset: any }>);

  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        {Object.entries(groupedPortfolio).map(([type, data]) => {
          const Icon = emotionIcons[type as EmotionType];
          const color = emotionColors[type as EmotionType];
          
          return (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setActivatingEmotion(data.items[0])}
            >
              <div className={`w-5 h-5 rounded bg-gradient-to-br ${color} flex items-center justify-center`}>
                <Icon className="w-3 h-3 text-white" />
              </div>
              <span>x{data.totalQuantity}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-pink-500" />
            Mon Portfolio Émotionnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedPortfolio).map(([type, data], index) => {
                const Icon = emotionIcons[type as EmotionType];
                const color = emotionColors[type as EmotionType];
                const label = emotionLabels[type as EmotionType];
                const lastUsed = data.items[0].last_used_at;
                
                return (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className={`h-1 bg-gradient-to-r ${color}`} />
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{label}</p>
                            <p className="text-xs text-muted-foreground">
                              x{data.totalQuantity} disponible{data.totalQuantity > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastUsed && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                            <Clock className="w-3 h-3" />
                            <span>
                              Dernière utilisation: {new Date(lastUsed).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        
                        <Button
                          size="sm"
                          className={`w-full bg-gradient-to-r ${color}`}
                          onClick={() => setActivatingEmotion(data.items[0])}
                          disabled={data.totalQuantity === 0}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Activer
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Activation Dialog */}
      <Dialog open={!!activatingEmotion} onOpenChange={(open) => !open && setActivatingEmotion(null)}>
        <DialogContent>
          {activatingEmotion && (() => {
            const asset = assets?.find(a => a.id === activatingEmotion.asset_id);
            if (!asset) return null;
            
            const Icon = emotionIcons[asset.emotion_type as EmotionType];
            const color = emotionColors[asset.emotion_type as EmotionType];
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    Activer {asset.name}
                  </DialogTitle>
                  <DialogDescription>
                    {asset.description || `Activez cette émotion pour en ressentir les effets.`}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Intensité</span>
                      <Badge>{asset.intensity}/10</Badge>
                    </div>
                    <Progress value={asset.intensity * 10} className="h-2" />
                    
                    {asset.music_config && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Musique</span>
                        <span>{asset.music_config.genre} • {asset.music_config.tempo} BPM</span>
                      </div>
                    )}
                    
                    {asset.ambient_config && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ambiance</span>
                        <div 
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: asset.ambient_config.color }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm">Quantité disponible</span>
                    <span className="font-bold">{activatingEmotion.quantity}</span>
                  </div>
                  
                  <Button
                    className={`w-full bg-gradient-to-r ${color}`}
                    onClick={() => handleActivate(activatingEmotion)}
                    disabled={isActivating || activatingEmotion.quantity === 0}
                  >
                    {isActivating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                        </motion.div>
                        Activation en cours...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Activer maintenant
                      </>
                    )}
                  </Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmotionPortfolioPanel;
