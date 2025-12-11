// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Lightbulb, Heart, Share2, X, RefreshCw, ChevronLeft, ChevronRight, Clock, Star, Bookmark, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const FAVORITES_KEY = 'glow_tip_favorites';
const HISTORY_KEY = 'glow_tip_history';
const DISMISSED_KEY = 'glow_tip_dismissed';

// Default tips pool
const DEFAULT_TIPS = [
  { id: '1', text: "Prenez 3 respirations profondes pour recentrer votre attention", category: 'breathing' },
  { id: '2', text: "Buvez un verre d'eau pour hydrater votre corps et votre esprit", category: 'wellness' },
  { id: '3', text: "Faites une pause de 5 minutes loin des écrans", category: 'digital' },
  { id: '4', text: "Notez 3 choses pour lesquelles vous êtes reconnaissant(e)", category: 'gratitude' },
  { id: '5', text: "Étirez-vous doucement pendant 2 minutes", category: 'movement' },
  { id: '6', text: "Envoyez un message positif à quelqu'un que vous appréciez", category: 'social' },
  { id: '7', text: "Écoutez votre morceau préféré pour booster votre humeur", category: 'music' },
  { id: '8', text: "Regardez par la fenêtre et observez la nature quelques instants", category: 'mindfulness' },
];

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  breathing: { icon: '🌬️', color: 'from-blue-500/20 to-cyan-500/20', label: 'Respiration' },
  wellness: { icon: '💧', color: 'from-teal-500/20 to-emerald-500/20', label: 'Bien-être' },
  digital: { icon: '📵', color: 'from-purple-500/20 to-pink-500/20', label: 'Digital' },
  gratitude: { icon: '🙏', color: 'from-amber-500/20 to-orange-500/20', label: 'Gratitude' },
  movement: { icon: '🧘', color: 'from-green-500/20 to-lime-500/20', label: 'Mouvement' },
  social: { icon: '💬', color: 'from-rose-500/20 to-pink-500/20', label: 'Social' },
  music: { icon: '🎵', color: 'from-indigo-500/20 to-violet-500/20', label: 'Musique' },
  mindfulness: { icon: '🌿', color: 'from-emerald-500/20 to-green-500/20', label: 'Pleine conscience' },
};

interface GlowTipProps {
  text?: string;
  onDismiss?: () => void;
  onAction?: () => void;
  showNavigation?: boolean;
  autoRotate?: boolean;
  autoRotateInterval?: number;
}

export const GlowTip: React.FC<GlowTipProps> = ({ 
  text: externalText,
  onDismiss,
  onAction,
  showNavigation = true,
  autoRotate = false,
  autoRotateInterval = 30000
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<{ id: string; viewedAt: string }[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Get available tips (not dismissed)
  const availableTips = DEFAULT_TIPS.filter(tip => !dismissed.includes(tip.id));
  const currentTip = externalText 
    ? { id: 'external', text: externalText, category: 'wellness' }
    : availableTips[currentTipIndex % availableTips.length];

  // Load saved data
  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    const savedDismissed = localStorage.getItem(DISMISSED_KEY);
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedDismissed) setDismissed(JSON.parse(savedDismissed));
  }, []);

  // Auto-rotate tips
  useEffect(() => {
    if (!autoRotate || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % availableTips.length);
    }, autoRotateInterval);
    
    return () => clearInterval(interval);
  }, [autoRotate, autoRotateInterval, isHovered, availableTips.length]);

  // Track view in history
  useEffect(() => {
    if (!currentTip) return;
    
    const newHistory = [
      { id: currentTip.id, viewedAt: new Date().toISOString() },
      ...history.filter(h => h.id !== currentTip.id)
    ].slice(0, 50);
    
    setHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  }, [currentTip?.id]);

  if (!currentTip || (availableTips.length === 0 && !externalText)) return null;

  const categoryConfig = CATEGORY_CONFIG[currentTip.category] || CATEGORY_CONFIG.wellness;
  const isFavorite = favorites.includes(currentTip.id);

  const toggleFavorite = () => {
    const newFavorites = isFavorite
      ? favorites.filter(f => f !== currentTip.id)
      : [...favorites, currentTip.id];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      duration: 2000
    });
  };

  const handleDismiss = () => {
    if (currentTip.id !== 'external') {
      const newDismissed = [...dismissed, currentTip.id];
      setDismissed(newDismissed);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(newDismissed));
    }
    onDismiss?.();
    nextTip();
  };

  const handleShare = async () => {
    const shareText = `💡 Conseil bien-être : "${currentTip.text}" - EmotionsCare`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // Cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copié !', description: 'Conseil copié dans le presse-papier' });
    }
  };

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentTip.text);
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    }
  };

  const nextTip = () => setCurrentTipIndex(prev => (prev + 1) % availableTips.length);
  const prevTip = () => setCurrentTipIndex(prev => (prev - 1 + availableTips.length) % availableTips.length);

  const resetDismissed = () => {
    setDismissed([]);
    localStorage.removeItem(DISMISSED_KEY);
    toast({ title: 'Conseils réinitialisés', description: 'Tous les conseils sont à nouveau visibles' });
  };

  // Get favorite tips
  const favoriteTips = DEFAULT_TIPS.filter(tip => favorites.includes(tip.id));

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`relative p-4 rounded-xl bg-gradient-to-r ${categoryConfig.color} border border-primary/10 overflow-hidden`}
      >
        {/* Category badge */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className="text-xs bg-background/50">
            {categoryConfig.icon} {categoryConfig.label}
          </Badge>
          
          <div className="flex items-center gap-1">
            {/* Favorites toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowFavorites(!showFavorites)}
                >
                  <Bookmark className={`h-4 w-4 ${showFavorites ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voir favoris ({favorites.length})</TooltipContent>
            </Tooltip>

            {availableTips.length < DEFAULT_TIPS.length && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={resetDismissed}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Réinitialiser ({dismissed.length} masqués)</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Favorites view */}
        <AnimatePresence mode="wait">
          {showFavorites ? (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-2"
            >
              {favoriteTips.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Aucun conseil favori. Cliquez sur ❤️ pour en ajouter !
                </p>
              ) : (
                favoriteTips.slice(0, 3).map((tip) => (
                  <div 
                    key={tip.id}
                    className="p-2 bg-background/50 rounded-lg text-sm flex items-center gap-2"
                  >
                    <span>{CATEGORY_CONFIG[tip.category]?.icon}</span>
                    <span className="flex-1 line-clamp-1">{tip.text}</span>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tip"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Main tip content */}
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="p-2 rounded-full bg-background/80"
                >
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {currentTip.text}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary/10">
          {/* Navigation */}
          {showNavigation && !showFavorites && availableTips.length > 1 && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevTip}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentTipIndex + 1}/{availableTips.length}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextTip}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {showFavorites && <div />}

          {/* Action buttons */}
          {!showFavorites && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={speak}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Écouter</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFavorite ? 'Retirer' : 'Favoris'}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partager</TooltipContent>
              </Tooltip>

              {onAction && (
                <Button size="sm" className="ml-2" onClick={onAction}>
                  <Star className="h-3 w-3 mr-1" />
                  Appliquer
                </Button>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={handleDismiss}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Masquer ce conseil</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* History indicator */}
        {history.length > 0 && !showFavorites && (
          <div className="absolute bottom-1 left-4 text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {history.length} conseils vus
          </div>
        )}

        {/* Progress dots for auto-rotate */}
        {autoRotate && !showFavorites && availableTips.length > 1 && (
          <div className="absolute bottom-1 right-4 flex gap-1">
            {availableTips.slice(0, 5).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  idx === currentTipIndex % availableTips.length ? 'bg-primary' : 'bg-primary/30'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
};
