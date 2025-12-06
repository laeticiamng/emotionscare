/**
 * Exchange Hub - Main dashboard for all markets
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Trophy,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useExchangeProfile } from '../hooks/useExchangeData';
import ImprovementMarket from './ImprovementMarket';
import TrustMarket from './TrustMarket';
import TimeExchangeMarket from './TimeExchangeMarket';
import EmotionMarket from './EmotionMarket';
import ExchangeLeaderboard from './ExchangeLeaderboard';

const markets = [
  {
    id: 'improvement',
    name: 'Improvement Market',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    description: 'Trackez et valorisez votre progression personnelle',
    stats: { label: 'Score moyen', value: '72%' }
  },
  {
    id: 'trust',
    name: 'Trust Market',
    icon: Shield,
    color: 'from-blue-500 to-indigo-600',
    description: 'Échangez et investissez votre confiance',
    stats: { label: 'Pool total', value: '12.4K' }
  },
  {
    id: 'time',
    name: 'Time Exchange',
    icon: Clock,
    color: 'from-amber-500 to-orange-600',
    description: 'Échangez votre temps et vos compétences',
    stats: { label: 'Offres actives', value: '847' }
  },
  {
    id: 'emotion',
    name: 'Emotion Exchange',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    description: 'Achetez et vendez des expériences émotionnelles',
    stats: { label: 'Volume 24h', value: '2.3K' }
  }
];

const ExchangeHub: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<string | null>(null);
  const { data: profile } = useExchangeProfile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" aria-hidden="true" />
              EmotionsCare Exchange V2.0
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Exchange Hub
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              La première plateforme mondiale où émotions, temps, confiance et progression 
              deviennent des valeurs interactives et échangeables.
            </p>
          </motion.div>

          {/* User Stats Bar */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-6 mb-12"
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Trophy className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Niveau</p>
                    <p className="font-bold text-lg">{profile.level}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="p-2 rounded-full bg-amber-500/10">
                    <Zap className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">XP Total</p>
                    <p className="font-bold text-lg">{profile.total_xp.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="p-2 rounded-full bg-emerald-500/10">
                    <BarChart3 className="w-5 h-5 text-emerald-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Badges</p>
                    <p className="font-bold text-lg">{profile.badges?.length || 0}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Markets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {markets.map((market, index) => (
              <motion.div
                key={market.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card 
                  className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  onClick={() => setActiveMarket(market.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setActiveMarket(market.id)}
                  aria-label={`Ouvrir ${market.name}`}
                >
                  <div className={`h-2 bg-gradient-to-r ${market.color}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${market.color} text-white`}>
                        <market.icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg mt-3">{market.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {market.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{market.stats.label}</span>
                      <span className="font-bold text-primary">{market.stats.value}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Content */}
      <AnimatePresence mode="wait">
        {activeMarket && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="container mx-auto px-4 pb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveMarket(null)}
                aria-label="Retour au hub"
              >
                ← Retour au Hub
              </Button>
            </div>

            <Tabs value={activeMarket} onValueChange={setActiveMarket} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8" aria-label="Sélection du marché">
                {markets.map((m) => (
                  <TabsTrigger 
                    key={m.id} 
                    value={m.id}
                    className="flex items-center gap-2"
                  >
                    <m.icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden md:inline">{m.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="improvement">
                <ImprovementMarket />
              </TabsContent>
              <TabsContent value="trust">
                <TrustMarket />
              </TabsContent>
              <TabsContent value="time">
                <TimeExchangeMarket />
              </TabsContent>
              <TabsContent value="emotion">
                <EmotionMarket />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Section */}
      {!activeMarket && (
        <div className="container mx-auto px-4 pb-12">
          <ExchangeLeaderboard />
        </div>
      )}
    </div>
  );
};

export default ExchangeHub;
