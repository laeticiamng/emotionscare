// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BarChart4,
  Users,
  Calendar,
  Headset,
  Shield,
  Lock,
  Star,
  StarOff,
  Play,
  CheckCircle2,
  Sparkles,
  Heart,
  Brain,
  Wind,
  BookOpen,
  Music,
  Zap,
  Eye,
  Info
} from "lucide-react";
import FeatureCard from '@/components/onboarding/FeatureCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeaturesTourProps {
  onContinue: () => void;
  onBack: () => void;
  emotion: string;
  onResponse: (key: string, value: any) => void;
}

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  category: 'core' | 'wellness' | 'social' | 'security';
  badge?: string;
  tooltip?: string;
  demoAvailable?: boolean;
  recommended?: boolean;
  premium?: boolean;
}

const FAVORITES_KEY = 'onboarding_feature_favorites';

const features: Feature[] = [
  {
    id: 'emotion-tracking',
    icon: BarChart4,
    title: "Suivi des émotions",
    description: "Visualisez l'évolution de vos émotions au fil du temps avec des graphiques détaillés.",
    category: 'core',
    tooltip: "Vos données émotionnelles sont anonymisées et chiffrées avec AES-256.",
    demoAvailable: true,
    recommended: true
  },
  {
    id: 'breathing',
    icon: Wind,
    title: "Exercices de respiration",
    description: "Techniques guidées pour réduire le stress et retrouver le calme.",
    category: 'wellness',
    demoAvailable: true,
    recommended: true
  },
  {
    id: 'journal',
    icon: BookOpen,
    title: "Journal émotionnel",
    description: "Exprimez vos pensées et suivez votre parcours de bien-être.",
    category: 'wellness',
    demoAvailable: true
  },
  {
    id: 'music',
    icon: Music,
    title: "Musique adaptative",
    description: "Playlists personnalisées selon votre humeur et vos préférences.",
    category: 'wellness',
    badge: "IA",
    demoAvailable: true
  },
  {
    id: 'community',
    icon: Users,
    title: "Communauté",
    description: "Partagez vos expériences avec une communauté bienveillante.",
    category: 'social',
    badge: "RGPD",
    tooltip: "Contrôlez exactement ce que vous partagez et avec qui."
  },
  {
    id: 'challenges',
    icon: Calendar,
    title: "Défis personnalisés",
    description: "Relevez des défis adaptés à votre état émotionnel.",
    category: 'core',
    badge: "Gamification"
  },
  {
    id: 'ai-coach',
    icon: Brain,
    title: "Coach IA",
    description: "Un assistant intelligent pour vous guider dans votre parcours.",
    category: 'core',
    badge: "Premium",
    premium: true,
    demoAvailable: true
  },
  {
    id: 'privacy',
    icon: Shield,
    title: "Confidentialité avancée",
    description: "Contrôle total sur vos données personnelles.",
    category: 'security',
    badge: "Premium",
    tooltip: "Chiffrement AES-256-GCM et TLS 1.3 avec gestion avancée des clés cryptographiques.",
    premium: true
  },
  {
    id: 'ethics',
    icon: Lock,
    title: "Éthique et transparence",
    description: "Comprenez comment nous utilisons vos données.",
    category: 'security',
    tooltip: "Recevez des rapports automatisés sur l'utilisation de vos données."
  }
];

const categories = [
  { id: 'all', label: 'Toutes', icon: Sparkles },
  { id: 'core', label: 'Essentielles', icon: Zap },
  { id: 'wellness', label: 'Bien-être', icon: Heart },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'security', label: 'Sécurité', icon: Shield },
];

const FeaturesTour: React.FC<FeaturesTourProps> = ({ 
  onContinue, 
  onBack, 
  emotion, 
  onResponse 
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['emotion-tracking', 'breathing']);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<Feature | null>(null);
  const [viewedFeatures, setViewedFeatures] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    
    // Mark recommended features based on emotion
    const recommended = features
      .filter(f => f.recommended || (emotion === 'stress' && f.id === 'breathing'))
      .map(f => f.id);
    setSelectedFeatures(prev => [...new Set([...prev, ...recommended])]);
  }, [emotion]);

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      onResponse('selected_features', newFeatures);
      return newFeatures;
    });
  };

  const toggleFavorite = (featureId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const openDemo = (feature: Feature) => {
    setSelectedDemo(feature);
    setShowDemoDialog(true);
    if (!viewedFeatures.includes(feature.id)) {
      setViewedFeatures(prev => [...prev, feature.id]);
    }
  };

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(f => f.category === activeCategory);

  const progress = (viewedFeatures.length / features.filter(f => f.demoAvailable).length) * 100;

  const handleContinue = () => {
    onResponse('selected_features', selectedFeatures);
    onResponse('favorite_features', favorites);
    onContinue();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-2">
            <Eye className="h-3 w-3 mr-1" />
            Découverte
          </Badge>
          <h2 className="text-2xl font-bold mb-2">Explorez les fonctionnalités</h2>
          <p className="text-muted-foreground">
            Sélectionnez les fonctionnalités qui vous intéressent
          </p>
        </motion.div>

        {/* Security Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900"
        >
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Votre bien-être, notre priorité
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                EmotionsCare s'engage à protéger vos données avec les plus hauts standards de sécurité et d'éthique.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Progress */}
        {viewedFeatures.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-muted/30 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Démos visionnées</span>
              <span className="text-sm text-muted-foreground">
                {viewedFeatures.length}/{features.filter(f => f.demoAvailable).length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="gap-2"
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </Button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`relative overflow-hidden transition-all hover:shadow-md ${
                    selectedFeatures.includes(feature.id) 
                      ? 'ring-2 ring-primary' 
                      : ''
                  } ${feature.premium ? 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20' : ''}`}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          selectedFeatures.includes(feature.id) 
                            ? 'bg-primary/20' 
                            : 'bg-muted'
                        }`}>
                          <feature.icon className={`h-5 w-5 ${
                            selectedFeatures.includes(feature.id) 
                              ? 'text-primary' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{feature.title}</h3>
                          {feature.badge && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(feature.id);
                              }}
                            >
                              {favorites.includes(feature.id) ? (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {favorites.includes(feature.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          </TooltipContent>
                        </Tooltip>
                        
                        {feature.tooltip && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Info className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {feature.tooltip}
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4">
                      {feature.description}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={feature.id}
                          checked={selectedFeatures.includes(feature.id)}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                        <label 
                          htmlFor={feature.id}
                          className="text-sm cursor-pointer"
                        >
                          {selectedFeatures.includes(feature.id) ? 'Activé' : 'Activer'}
                        </label>
                      </div>
                      
                      {feature.demoAvailable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDemo(feature)}
                          className="gap-1"
                        >
                          <Play className="h-3 w-3" />
                          Démo
                        </Button>
                      )}
                    </div>

                    {/* Viewed indicator */}
                    {viewedFeatures.includes(feature.id) && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    )}

                    {/* Recommended badge */}
                    {feature.recommended && (
                      <div className="absolute top-0 left-0">
                        <Badge className="rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-primary text-primary-foreground text-xs">
                          Recommandé
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Selected summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/30 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedFeatures.length} fonctionnalités sélectionnées</p>
              <p className="text-sm text-muted-foreground">
                {favorites.length > 0 && `${favorites.length} favoris • `}
                Vous pourrez modifier ces choix plus tard
              </p>
            </div>
            {selectedFeatures.length >= 3 && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Prêt
              </Badge>
            )}
          </div>
        </motion.div>
        
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between"
        >
          <Button variant="outline" onClick={onBack}>
            Précédent
          </Button>
          <Button onClick={handleContinue}>
            Continuer
          </Button>
        </motion.div>

        {/* Demo Dialog */}
        <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedDemo && <selectedDemo.icon className="h-5 w-5 text-primary" />}
                {selectedDemo?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedDemo?.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <Play className="h-16 w-16 mx-auto mb-4 text-primary/50" />
                <p className="text-muted-foreground">
                  Démo interactive de {selectedDemo?.title}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  La démo sera disponible après l'onboarding
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setShowDemoDialog(false)}>
                Fermer
              </Button>
              <Button onClick={() => {
                if (selectedDemo && !selectedFeatures.includes(selectedDemo.id)) {
                  toggleFeature(selectedDemo.id);
                }
                setShowDemoDialog(false);
              }}>
                {selectedDemo && selectedFeatures.includes(selectedDemo.id) 
                  ? 'Déjà activé' 
                  : 'Activer cette fonctionnalité'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default FeaturesTour;
