/**
 * Emotion Portfolio Panel - Display, activate and sell emotions from portfolio
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
  TrendingUp,
  DollarSign,
  Minus,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useEmotionPortfolio, useUseEmotionAsset, useEmotionAssets, useSellEmotionAsset } from '../hooks/useExchangeData';
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
  const sellAsset = useSellEmotionAsset();
  const [activatingEmotion, setActivatingEmotion] = React.useState<EmotionPortfolio | null>(null);
  const [sellingEmotion, setSellingEmotion] = React.useState<EmotionPortfolio | null>(null);
  const [sellQuantity, setSellQuantity] = React.useState(1);
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

  const handleSell = async () => {
    if (!sellingEmotion) return;
    
    try {
      const result = await sellAsset.mutateAsync({
        portfolioId: sellingEmotion.id,
        assetId: sellingEmotion.asset_id,
        quantity: sellQuantity,
      });
      
      const asset = assets?.find(a => a.id === sellingEmotion.asset_id);
      toast.success(`${sellQuantity}x ${asset?.name || 'Émotion'} vendu(e) !`, {
        description: `+${result.totalPrice.toFixed(0)} EC (après frais 10%)`,
      });
      setSellingEmotion(null);
      setSellQuantity(1);
    } catch (error: any) {
      toast.error(error?.message || 'Erreur lors de la vente');
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
        totalValue: 0,
      };
    }
    acc[key].items.push(item);
    acc[key].totalQuantity += item.quantity;
    acc[key].totalValue += item.quantity * asset.current_price;
    return acc;
  }, {} as Record<string, { items: EmotionPortfolio[]; totalQuantity: number; asset: any; totalValue: number }>);

  const totalPortfolioValue = Object.values(groupedPortfolio).reduce((acc, g) => acc + g.totalValue, 0);

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Portfolio</span>
            </div>
            <Badge variant="secondary">{totalPortfolioValue.toFixed(0)} EC</Badge>
          </div>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-pink-500" />
              Mon Portfolio Émotionnel
            </CardTitle>
            <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20">
              {totalPortfolioValue.toFixed(0)} EC
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {Object.entries(groupedPortfolio).map(([type, data], index) => {
                const Icon = emotionIcons[type as EmotionType];
                const color = emotionColors[type as EmotionType];
                const label = emotionLabels[type as EmotionType];
                const lastUsed = data.items[0].last_used_at;
                const gainLoss = data.totalValue - (data.items.reduce((acc, i) => acc + i.acquired_price * i.quantity, 0));
                
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
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground">
                                x{data.totalQuantity}
                              </span>
                              <span className={`text-xs ${gainLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                ({gainLoss >= 0 ? '+' : ''}{gainLoss.toFixed(0)} EC)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Valeur: {data.totalValue.toFixed(0)} EC</span>
                          {lastUsed && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(lastUsed).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className={`flex-1 bg-gradient-to-r ${color}`}
                            onClick={() => setActivatingEmotion(data.items[0])}
                            disabled={data.totalQuantity === 0}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Activer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSellingEmotion(data.items[0]);
                              setSellQuantity(1);
                            }}
                          >
                            <DollarSign className="w-3 h-3" />
                          </Button>
                        </div>
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

      {/* Sell Dialog */}
      <Dialog open={!!sellingEmotion} onOpenChange={(open) => !open && setSellingEmotion(null)}>
        <DialogContent>
          {sellingEmotion && (() => {
            const asset = assets?.find(a => a.id === sellingEmotion.asset_id);
            if (!asset) return null;
            
            const Icon = emotionIcons[asset.emotion_type as EmotionType];
            const color = emotionColors[asset.emotion_type as EmotionType];
            const salePrice = asset.current_price * 0.9 * sellQuantity;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    Vendre {asset.name}
                  </DialogTitle>
                  <DialogDescription>
                    Les ventes sont soumises à 10% de frais de transaction.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Prix actuel</span>
                    <span className="font-bold">{asset.current_price} EC</span>
                  </div>
                  
                  <div>
                    <Label>Quantité à vendre</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSellQuantity(Math.max(1, sellQuantity - 1))}
                        disabled={sellQuantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(Math.min(sellingEmotion.quantity, Math.max(1, parseInt(e.target.value) || 1)))}
                        className="text-center"
                        min={1}
                        max={sellingEmotion.quantity}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSellQuantity(Math.min(sellingEmotion.quantity, sellQuantity + 1))}
                        disabled={sellQuantity >= sellingEmotion.quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Disponible: {sellingEmotion.quantity}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vous recevrez</span>
                      <span className="text-xl font-bold text-emerald-600">{salePrice.toFixed(0)} EC</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Après frais de 10%
                    </p>
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                    onClick={handleSell}
                    disabled={sellAsset.isPending}
                  >
                    {sellAsset.isPending ? 'Vente en cours...' : `Vendre ${sellQuantity}x pour ${salePrice.toFixed(0)} EC`}
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
