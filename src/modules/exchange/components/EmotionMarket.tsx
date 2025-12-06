/**
 * Emotion Exchange Market - Buy and sell emotional experiences
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles,
  Zap,
  Sun,
  Brain,
  Shield,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Play,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEmotionAssets, useEmotionPortfolio, useBuyEmotionAsset } from '../hooks/useExchangeData';
import type { EmotionType, EmotionAsset } from '../types';
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

const EmotionMarket: React.FC = () => {
  const { data: assets, isLoading: assetsLoading } = useEmotionAssets();
  const { data: portfolio } = useEmotionPortfolio();
  const buyAsset = useBuyEmotionAsset();
  const [selectedAsset, setSelectedAsset] = useState<EmotionAsset | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleBuy = async () => {
    if (!selectedAsset) return;

    try {
      await buyAsset.mutateAsync({ assetId: selectedAsset.id, quantity });
      toast.success(`${quantity}x ${selectedAsset.name} acheté !`);
      setSelectedAsset(null);
      setQuantity(1);
    } catch (error) {
      toast.error('Erreur lors de l\'achat');
    }
  };

  // Calculate portfolio stats
  const portfolioValue = portfolio?.reduce((acc, p) => {
    const asset = assets?.find(a => a.id === p.asset_id);
    return acc + (asset?.current_price || 0) * p.quantity;
  }, 0) || 0;

  const portfolioCount = portfolio?.reduce((acc, p) => acc + p.quantity, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Market Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" aria-hidden="true" />
            Emotion Exchange
          </h2>
          <p className="text-muted-foreground">
            Achetez et vendez des expériences émotionnelles
          </p>
        </div>
      </div>

      {/* Portfolio Overview */}
      <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                <Wallet className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Votre Portfolio</p>
                <p className="text-3xl font-bold">{portfolioValue.toFixed(0)} EC</p>
                <p className="text-xs text-muted-foreground">{portfolioCount} assets</p>
              </div>
            </div>
            
            {/* Quick Portfolio View */}
            <div className="flex gap-2 flex-wrap justify-center">
              {portfolio?.slice(0, 5).map((p) => {
                const asset = assets?.find(a => a.id === p.asset_id);
                if (!asset) return null;
                const Icon = emotionIcons[asset.emotion_type as EmotionType];
                const color = emotionColors[asset.emotion_type as EmotionType];
                
                return (
                  <div 
                    key={p.id}
                    className={`p-2 rounded-lg bg-gradient-to-br ${color} flex items-center gap-2`}
                  >
                    <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                    <span className="text-white text-sm font-medium">x{p.quantity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(emotionLabels).map(([type, label]) => {
          const asset = assets?.find(a => a.emotion_type === type);
          const Icon = emotionIcons[type as EmotionType];
          const color = emotionColors[type as EmotionType];
          const priceChange = asset ? asset.current_price - asset.base_price : 0;
          const isUp = priceChange >= 0;
          
          return (
            <Card 
              key={type}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => asset && setSelectedAsset(asset)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && asset && setSelectedAsset(asset)}
              aria-label={`Voir les détails de ${label}`}
            >
              <CardContent className="p-3 text-center">
                <div className={`w-10 h-10 mx-auto rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <p className="text-xs font-medium">{label}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="font-bold">{asset?.current_price || 0}</span>
                  {isUp ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-rose-500" aria-hidden="true" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Assets Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Assets Émotionnels</h3>
        
        {assetsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-64" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets?.map((asset, index) => {
              const Icon = emotionIcons[asset.emotion_type as EmotionType];
              const color = emotionColors[asset.emotion_type as EmotionType];
              const priceChange = asset.current_price - asset.base_price;
              const priceChangePercent = ((priceChange / asset.base_price) * 100).toFixed(1);
              const isUp = priceChange >= 0;
              
              return (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className={`h-24 bg-gradient-to-br ${color} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-white/80" aria-hidden="true" />
                      </div>
                      {asset.is_premium && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{asset.name}</CardTitle>
                          <Badge variant="outline" className="capitalize mt-1">
                            {emotionLabels[asset.emotion_type as EmotionType]}
                          </Badge>
                        </div>
                        <div className={`flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isUp ? <TrendingUp className="w-4 h-4" aria-hidden="true" /> : <TrendingDown className="w-4 h-4" aria-hidden="true" />}
                          <span className="text-sm font-medium">{isUp ? '+' : ''}{priceChangePercent}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {asset.description}
                      </p>
                      
                      {/* Intensity Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Intensité</span>
                          <span>{asset.intensity}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${color}`}
                            style={{ width: `${asset.intensity}%` }}
                          />
                        </div>
                      </div>

                      {/* Price and Stats */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-xs text-muted-foreground">Prix actuel</p>
                          <p className="text-xl font-bold">{asset.current_price} EC</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Demande</p>
                          <p className="font-medium">{asset.demand_score}/100</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          aria-label={`Prévisualiser ${asset.name}`}
                        >
                          <Play className="w-4 h-4 mr-1" aria-hidden="true" />
                          Preview
                        </Button>
                        <Button 
                          className={`flex-1 bg-gradient-to-r ${color}`}
                          onClick={() => setSelectedAsset(asset)}
                          aria-label={`Acheter ${asset.name}`}
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" aria-hidden="true" />
                          Acheter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buy Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acheter {selectedAsset?.name}</DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 pt-4">
              {/* Asset Preview */}
              <div className={`h-32 rounded-lg bg-gradient-to-br ${emotionColors[selectedAsset.emotion_type as EmotionType]} flex items-center justify-center`}>
                {React.createElement(emotionIcons[selectedAsset.emotion_type as EmotionType], {
                  className: 'w-16 h-16 text-white/80',
                  'aria-hidden': true
                })}
              </div>

              <p className="text-sm text-muted-foreground">
                {selectedAsset.description}
              </p>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Quantité</span>
                  <span className="font-bold">{quantity}</span>
                </div>
                <Slider
                  value={[quantity]}
                  onValueChange={([v]) => setQuantity(v)}
                  min={1}
                  max={10}
                  step={1}
                  aria-label="Quantité à acheter"
                />
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Total</span>
                <span className="text-2xl font-bold">
                  {(selectedAsset.current_price * quantity).toFixed(0)} EC
                </span>
              </div>

              <Button 
                onClick={handleBuy}
                className={`w-full bg-gradient-to-r ${emotionColors[selectedAsset.emotion_type as EmotionType]}`}
                disabled={buyAsset.isPending}
              >
                {buyAsset.isPending ? 'Achat en cours...' : 'Confirmer l\'achat'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmotionMarket;
