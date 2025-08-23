import React, { memo, useCallback, useMemo, Suspense } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Scan, Camera, Upload, History, Brain, Zap, Eye, TrendingUp, Download, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { EnhancedLoading, OptimizedImage } from '@/components/ui/enhanced-performance';
import { InteractiveCard, Rating } from '@/components/ui/enhanced-user-experience';
import { announce } from '@/components/ui/enhanced-accessibility';

// Mock data pour la démonstration
const mockScans = [
  { 
    id: 1, 
    date: '2024-01-15', 
    emotions: { joie: 0.8, calme: 0.6, stress: 0.2 }, 
    type: 'camera',
    accuracy: 94 
  },
  { 
    id: 2, 
    date: '2024-01-14', 
    emotions: { concentration: 0.7, fatigue: 0.4, bien_etre: 0.8 }, 
    type: 'photo',
    accuracy: 89 
  }
];

// Memoized Components
const MemoizedScanCard = memo<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  glowColor: string;
  action: string;
  onAction: () => void;
  isPremium?: boolean;
  index: number;
  shouldReduceMotion: boolean;
}>(({ title, description, icon: Icon, gradient, glowColor, action, onAction, isPremium, index, shouldReduceMotion }) => {
  const cardVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  }), [index, shouldReduceMotion]);

  const handleAction = useCallback(() => {
    announce(`Démarrage de ${title}`);
    onAction();
  }, [title, onAction]);

  return (
    <motion.div variants={cardVariants}>
      <InteractiveCard
        title={title}
        description={description}
        className={cn(
          "h-full relative overflow-hidden group cursor-pointer",
          "bg-gradient-to-br from-background/95 via-background/90 to-background/85",
          "hover:from-background/98 hover:via-background/95 hover:to-background/90",
          "border-2 border-border/50 hover:border-primary/30",
          "transition-all duration-500"
        )}
        onBookmark={() => console.log('Bookmarked')}
        onShare={() => console.log('Shared')}
      >
        <div className="text-center space-y-6">
          {/* Icon with glow effect */}
          <motion.div 
            className={cn(
              "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center relative",
              `bg-gradient-to-br ${gradient}`,
              "shadow-lg group-hover:shadow-xl transition-all duration-500"
            )}
            whileHover={shouldReduceMotion ? {} : { 
              scale: 1.1,
              rotate: [0, -5, 5, 0]
            }}
            transition={{ duration: 0.6 }}
          >
            <Icon className="h-10 w-10 text-white" />
            
            {/* Glow effect */}
            <div className={cn(
              "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              `bg-gradient-to-br ${gradient} blur-lg -z-10 scale-110`
            )} />
          </motion.div>
          
          {/* Premium Badge */}
          {isPremium && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold">
              <Zap className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
          
          {/* Action Button */}
          <Button 
            className={cn(
              "w-full font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl",
              `bg-gradient-to-r ${gradient}`,
              "hover:scale-105 transition-all duration-300"
            )}
            onClick={handleAction}
          >
            <Icon className="mr-2 h-4 w-4" />
            {action}
          </Button>
        </div>
      </InteractiveCard>
    </motion.div>
  );
});

MemoizedScanCard.displayName = 'MemoizedScanCard';

const MemoizedScanHistory = memo<{
  scans: typeof mockScans;
  shouldReduceMotion: boolean;
}>(({ scans, shouldReduceMotion }) => {
  const renderEmotionBar = useCallback((emotion: string, value: number, color: string) => (
    <div key={emotion} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="capitalize text-foreground">{emotion}</span>
        <span className="text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <Progress 
        value={value * 100} 
        className={`h-2 ${color}`}
      />
    </div>
  ), []);

  if (scans.length === 0) {
    return (
      <motion.div
        className="text-center py-12 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.8 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="h-16 w-16 mx-auto text-muted-foreground/50" />
        </motion.div>
        <div>
          <p className="text-lg font-medium text-muted-foreground">
            Aucun scan effectué pour le moment
          </p>
          <p className="text-sm text-muted-foreground">
            Vos analyses apparaîtront ici après votre première session
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {scans.map((scan, index) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              delay: shouldReduceMotion ? 0 : index * 0.1,
              duration: shouldReduceMotion ? 0.01 : 0.4
            }}
            className="p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  scan.type === 'camera' 
                    ? "bg-blue-500/10 text-blue-600" 
                    : "bg-green-500/10 text-green-600"
                )}>
                  {scan.type === 'camera' ? 
                    <Camera className="h-4 w-4" /> : 
                    <Upload className="h-4 w-4" />
                  }
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Scan {scan.type === 'camera' ? 'en direct' : 'photo'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(scan.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {scan.accuracy}% précision
                </Badge>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(scan.emotions).map(([emotion, value]) => 
                renderEmotionBar(
                  emotion, 
                  value as number, 
                  emotion.includes('stress') || emotion.includes('fatigue') 
                    ? 'bg-red-500/20' 
                    : 'bg-primary/20'
                )
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

MemoizedScanHistory.displayName = 'MemoizedScanHistory';

const ScanPage: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const scanOptions = useMemo(() => [
    {
      title: 'Scan en Direct',
      description: 'Analysez vos émotions en temps réel avec votre caméra',
      icon: Camera,
      gradient: 'from-blue-500 to-blue-600',
      glowColor: 'blue-500',
      action: 'Démarrer le scan',
      isPremium: true
    },
    {
      title: 'Analyser une Photo',
      description: 'Importez une photo pour analyser les émotions capturées',
      icon: Upload,
      gradient: 'from-green-500 to-green-600',
      glowColor: 'green-500',
      action: 'Importer une photo',
      isPremium: false
    },
    {
      title: 'Scan Vocal',
      description: 'Analysez vos émotions à partir de votre voix',
      icon: Play,
      gradient: 'from-purple-500 to-purple-600',
      glowColor: 'purple-500',
      action: 'Commencer l\'analyse',
      isPremium: true
    }
  ], []);

  const handleScanAction = useCallback((type: string) => {
    console.log(`Starting ${type} scan`);
    // Ici vous ajouteriez la logique pour démarrer le scan
  }, []);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.6,
        staggerChildren: shouldReduceMotion ? 0 : 0.1
      }
    }
  }), [shouldReduceMotion]);

  const titleVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : -30
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.8,
        type: "spring",
        stiffness: 100
      }
    }
  }), [shouldReduceMotion]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8" data-testid="page-root">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={titleVariants} className="text-center space-y-6">
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl border border-primary/20 shadow-lg"
              whileHover={shouldReduceMotion ? {} : { 
                scale: 1.1, 
                rotate: [0, -10, 10, 0] 
              }}
              transition={{ duration: 0.6 }}
            >
              <Brain className="h-12 w-12 text-primary" />
            </motion.div>
          </div>
          
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Scanner Émotionnel IA
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Analysez et comprenez vos émotions grâce à l'intelligence artificielle avancée
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>95% de précision</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Analyse instantanée</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              <span>IA dernière génération</span>
            </div>
          </div>
        </motion.div>

        {/* Scan Options Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {scanOptions.map((option, index) => (
            <MemoizedScanCard
              key={option.title}
              {...option}
              onAction={() => handleScanAction(option.title)}
              index={index}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </motion.div>

        {/* History Section */}
        <motion.div
          variants={titleVariants}
          className="space-y-6"
        >
          <Card className="shadow-premium border-0 bg-background/80 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl font-bold">
                    Historique des Analyses
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-xs">
                  {mockScans.length} scan(s)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<EnhancedLoading message="Chargement de l'historique..." />}>
                <MemoizedScanHistory 
                  scans={mockScans} 
                  shouldReduceMotion={!!shouldReduceMotion}
                />
              </Suspense>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          variants={titleVariants}
          className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 rounded-2xl p-6 border border-primary/10"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Zap className="h-5 w-5 text-primary mr-2" />
            Conseils pour une meilleure analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Assurez-vous d'avoir un bon éclairage pour les scans caméra</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Regardez directement la caméra pour une analyse optimale</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <span>Adoptez une expression naturelle pour des résultats précis</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(ScanPage);