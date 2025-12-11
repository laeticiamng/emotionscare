/**
 * Emotion Exchange Market - Buy and sell emotional experiences (enriched)
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Wallet,
  Star,
  Bell,
  BellOff,
  History,
  Filter,
  Search,
  Share2,
  Eye,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useEmotionAssets, useEmotionPortfolio, useBuyEmotionAsset } from '../hooks/useExchangeData';
import type { EmotionType, EmotionAsset } from '../types';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';

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

interface Transaction {
  id: string;
  assetName: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  date: string;
}

type SortOption = 'price-asc' | 'price-desc' | 'demand' | 'name';

const EmotionMarket: React.FC = () => {
  const { toast: toastHook } = useToast();
  const { data: assets, isLoading: assetsLoading } = useEmotionAssets();
  const { data: portfolio } = useEmotionPortfolio();
  const buyAsset = useBuyEmotionAsset();
  
  const [selectedAsset, setSelectedAsset] = useState<EmotionAsset | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [emotionFilter, setEmotionFilter] = useState<EmotionType | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('demand');
  const [showHistory, setShowHistory] = useState(false);
  
  // Watchlist/Favorites
  const [watchlist, setWatchlist] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('emotionMarketWatchlist');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('emotionMarketAlerts');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Transaction History (mock)
  const [transactions] = useState<Transaction[]>([
    { id: '1', assetName: 'Calme Profond', type: 'buy', quantity: 2, price: 150, date: '2024-01-15' },
    { id: '2', assetName: 'Focus Intense', type: 'buy', quantity: 1, price: 200, date: '2024-01-14' },
    { id: '3', assetName: 'Joie Pure', type: 'sell', quantity: 1, price: 180, date: '2024-01-13' },
  ]);

  // Toggle watchlist
  const toggleWatchlist = (assetId: string) => {
    setWatchlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
        toastHook({ title: 'Retiré des favoris' });
      } else {
        newSet.add(assetId);
        toastHook({ title: 'Ajouté aux favoris', description: 'Vous recevrez des alertes de prix' });
      }
      localStorage.setItem('emotionMarketWatchlist', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  // Set price alert
  const setPriceAlert = (assetId: string, price: number) => {
    setPriceAlerts(prev => {
      const newAlerts = { ...prev, [assetId]: price };
      localStorage.setItem('emotionMarketAlerts', JSON.stringify(newAlerts));
      return newAlerts;
    });
    toastHook({ title: 'Alerte configurée', description: `Vous serez notifié quand le prix atteint ${price} EC` });
  };

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    
    let result = [...assets];
    
    // Search
    if (searchQuery) {
      result = result.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by emotion type
    if (emotionFilter !== 'all') {
      result = result.filter(a => a.emotion_type === emotionFilter);
    }
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.current_price - b.current_price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.current_price - a.current_price);
        break;
      case 'demand':
        result.sort((a, b) => b.demand_score - a.demand_score);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    return result;
  }, [assets, searchQuery, emotionFilter, sortBy]);

  // Watchlist assets
  const watchlistAssets = useMemo(() => {
    return assets?.filter(a => watchlist.has(a.id)) || [];
  }, [assets, watchlist]);

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

  const shareAsset = async (asset: EmotionAsset) => {
    const text = `🎭 Découvrez "${asset.name}" sur EmotionsCare Exchange!\n💰 Prix: ${asset.current_price} EC\n📈 Demande: ${asset.demand_score}/100`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: asset.name, text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toastHook({ title: 'Copié !', description: 'Lien copié dans le presse-papier' });
    }
  };

  // Calculate portfolio stats
  const portfolioValue = portfolio?.reduce((acc, p) => {
    const asset = assets?.find(a => a.id === p.asset_id);
    return acc + (asset?.current_price || 0) * p.quantity;
  }, 0) || 0;

  const portfolioCount = portfolio?.reduce((acc, p) => acc + p.quantity, 0) || 0;

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Market Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" aria-hidden="true" />
              Emotion Exchange
            </h2>
            <p className="text-muted-foreground">
              Achetez et vendez des expériences émotionnelles
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
              <History className="h-4 w-4 mr-2" />
              Historique
            </Button>
          </div>
        </div>

        {/* Tabs: Market / Watchlist */}
        <Tabs defaultValue="market">
          <TabsList>
            <TabsTrigger value="market">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Marché
            </TabsTrigger>
            <TabsTrigger value="watchlist">
              <Star className="h-4 w-4 mr-2" />
              Favoris ({watchlist.size})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6 mt-6">
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
                        <Tooltip key={p.id}>
                          <TooltipTrigger asChild>
                            <div 
                              className={`p-2 rounded-lg bg-gradient-to-br ${color} flex items-center gap-2 cursor-pointer`}
                            >
                              <Icon className="w-4 h-4 text-white" aria-hidden="true" />
                              <span className="text-white text-sm font-medium">x{p.quantity}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{asset.name}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un asset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={emotionFilter} onValueChange={(v) => setEmotionFilter(v as any)}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Émotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {Object.entries(emotionLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-36">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Trier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demand">Demande</SelectItem>
                  <SelectItem value="price-asc">Prix ↑</SelectItem>
                  <SelectItem value="price-desc">Prix ↓</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Assets Émotionnels</h3>
                <Badge variant="secondary">{filteredAssets.length} résultats</Badge>
              </div>
              
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
                  <AnimatePresence mode="popLayout">
                    {filteredAssets.map((asset, index) => {
                      const Icon = emotionIcons[asset.emotion_type as EmotionType];
                      const color = emotionColors[asset.emotion_type as EmotionType];
                      const priceChange = asset.current_price - asset.base_price;
                      const priceChangePercent = ((priceChange / asset.base_price) * 100).toFixed(1);
                      const isUp = priceChange >= 0;
                      const isInWatchlist = watchlist.has(asset.id);
                      
                      return (
                        <motion.div
                          key={asset.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          layout
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
                              
                              {/* Watchlist button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 left-2 h-8 w-8 bg-black/20 hover:bg-black/40"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWatchlist(asset.id);
                                }}
                              >
                                <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                              </Button>
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
                                  {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => shareAsset(asset)}>
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Partager</TooltipContent>
                                </Tooltip>
                                
                                <Button 
                                  variant="outline" 
                                  className="flex-1"
                                  aria-label={`Prévisualiser ${asset.name}`}
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Preview
                                </Button>
                                <Button 
                                  className={`flex-1 bg-gradient-to-r ${color}`}
                                  onClick={() => setSelectedAsset(asset)}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  Acheter
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
              
              {filteredAssets.length === 0 && !assetsLoading && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun asset trouvé</p>
                    <Button variant="link" onClick={() => { setSearchQuery(''); setEmotionFilter('all'); }}>
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="mt-6">
            {watchlistAssets.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucun asset en favoris</p>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez des assets à vos favoris pour suivre leurs prix
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchlistAssets.map((asset) => {
                  const Icon = emotionIcons[asset.emotion_type as EmotionType];
                  const color = emotionColors[asset.emotion_type as EmotionType];
                  
                  return (
                    <Card key={asset.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{asset.name}</p>
                            <p className="text-lg font-bold">{asset.current_price} EC</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleWatchlist(asset.id)}
                          >
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Buy Dialog */}
        <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Acheter {selectedAsset?.name}</DialogTitle>
            </DialogHeader>
            {selectedAsset && (
              <div className="space-y-6 pt-4">
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

        {/* History Dialog */}
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historique des transactions
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {transactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{tx.assetName}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={tx.type === 'buy' ? 'default' : 'secondary'}>
                      {tx.type === 'buy' ? 'Achat' : 'Vente'}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      {tx.quantity}x • {tx.price} EC
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default EmotionMarket;
