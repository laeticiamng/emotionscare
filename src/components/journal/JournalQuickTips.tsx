// @ts-nocheck

import { memo, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, Lightbulb, ChevronLeft, ChevronRight, Star, StarOff, 
  CheckCircle2, Share2, BookOpen, Heart, Sparkles, Target,
  Wind, Mic, Filter, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

interface JournalQuickTipsProps {
  className?: string;
}

interface Tip {
  id: string;
  title: string;
  content: string;
  category: 'writing' | 'features' | 'wellness' | 'productivity';
  icon: React.ElementType;
  actionLabel?: string;
  actionLink?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const COMPLETED_TIPS_KEY = 'journal_completed_tips';
const FAVORITE_TIPS_KEY = 'journal_favorite_tips';

const tips: Tip[] = [
  {
    id: 'consistency',
    title: 'Écrivez régulièrement',
    content: 'Même 5 minutes par jour peuvent faire une grande différence. La régularité est plus importante que la longueur.',
    category: 'wellness',
    icon: Heart,
    difficulty: 'beginner'
  },
  {
    id: 'tags',
    title: 'Utilisez des tags',
    content: 'Les tags vous aident à identifier des patterns émotionnels et à retrouver facilement vos notes par thème.',
    category: 'features',
    icon: Target,
    actionLabel: 'Voir les tags',
    difficulty: 'beginner'
  },
  {
    id: 'voice',
    title: 'Essayez la saisie vocale',
    content: 'Parfait quand vous êtes en déplacement ou préférez parler plutôt qu\'écrire. Activez le micro dans le composer.',
    category: 'features',
    icon: Mic,
    actionLabel: 'Activer le micro',
    difficulty: 'beginner'
  },
  {
    id: 'prompts',
    title: 'Utilisez les prompts',
    content: 'Besoin d\'inspiration ? Cliquez sur "Obtenir une suggestion" pour des idées d\'écriture guidée.',
    category: 'writing',
    icon: Lightbulb,
    actionLabel: 'Voir les prompts',
    difficulty: 'beginner'
  },
  {
    id: 'templates',
    title: 'Gagnez du temps avec les templates',
    content: 'Utilisez les templates pré-définis pour structurer vos réflexions quotidiennes, gratitudes ou objectifs.',
    category: 'productivity',
    icon: BookOpen,
    actionLabel: 'Voir les templates',
    difficulty: 'intermediate'
  },
  {
    id: 'backup',
    title: 'Sauvegardez vos données',
    content: 'Créez des backups réguliers de vos notes dans les paramètres pour ne jamais perdre vos réflexions.',
    category: 'features',
    icon: Sparkles,
    actionLabel: 'Paramètres',
    actionLink: '/settings',
    difficulty: 'intermediate'
  },
  {
    id: 'coach',
    title: 'Partagez avec votre coach',
    content: 'Les notes partagées permettent à votre coach de mieux vous accompagner tout en gardant le reste privé.',
    category: 'wellness',
    icon: Heart,
    difficulty: 'advanced'
  },
  {
    id: 'analytics',
    title: 'Consultez vos statistiques',
    content: 'Le tableau de bord analytics vous montre votre progression et vos habitudes d\'écriture au fil du temps.',
    category: 'features',
    icon: Target,
    actionLabel: 'Voir analytics',
    difficulty: 'intermediate'
  },
  {
    id: 'breathing',
    title: 'Respirez avant d\'écrire',
    content: 'Un exercice de respiration de 2 minutes avant d\'écrire peut améliorer la clarté de vos pensées.',
    category: 'wellness',
    icon: Wind,
    actionLabel: 'Exercice rapide',
    actionLink: '/app/breath',
    difficulty: 'beginner'
  },
  {
    id: 'morning',
    title: 'Journaling matinal',
    content: 'Écrire le matin aide à clarifier vos intentions pour la journée et à démarrer avec un esprit clair.',
    category: 'productivity',
    icon: Sparkles,
    difficulty: 'intermediate'
  },
];

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'writing', label: 'Écriture' },
  { id: 'features', label: 'Fonctionnalités' },
  { id: 'wellness', label: 'Bien-être' },
  { id: 'productivity', label: 'Productivité' },
];

const difficultyColors = {
  beginner: 'bg-green-500/10 text-green-600 border-green-200',
  intermediate: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  advanced: 'bg-purple-500/10 text-purple-600 border-purple-200',
};

const difficultyLabels = {
  beginner: 'Débutant',
  intermediate: 'Intermédiaire',
  advanced: 'Avancé',
};

/**
 * Composant de tips rapides enrichi pour le journal
 */
export const JournalQuickTips = memo<JournalQuickTipsProps>(({ className = '' }) => {
  const { toast } = useToast();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completedTips, setCompletedTips] = useState<string[]>([]);
  const [favoriteTips, setFavoriteTips] = useState<string[]>([]);
  const [showAllTips, setShowAllTips] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(COMPLETED_TIPS_KEY);
    const favorites = localStorage.getItem(FAVORITE_TIPS_KEY);
    if (completed) setCompletedTips(JSON.parse(completed));
    if (favorites) setFavoriteTips(JSON.parse(favorites));
  }, []);

  if (!isVisible) return null;

  const filteredTips = activeCategory === 'all' 
    ? tips 
    : tips.filter(t => t.category === activeCategory);

  const currentTip = filteredTips[currentTipIndex % filteredTips.length];
  const progress = (completedTips.length / tips.length) * 100;

  const handleNext = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const handlePrevious = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const toggleComplete = (tipId: string) => {
    const newCompleted = completedTips.includes(tipId)
      ? completedTips.filter(id => id !== tipId)
      : [...completedTips, tipId];
    setCompletedTips(newCompleted);
    localStorage.setItem(COMPLETED_TIPS_KEY, JSON.stringify(newCompleted));
    
    if (!completedTips.includes(tipId)) {
      toast({
        title: 'Conseil maîtrisé! 🎉',
        description: `Vous avez complété ${newCompleted.length}/${tips.length} conseils`,
      });
    }
  };

  const toggleFavorite = (tipId: string) => {
    const newFavorites = favoriteTips.includes(tipId)
      ? favoriteTips.filter(id => id !== tipId)
      : [...favoriteTips, tipId];
    setFavoriteTips(newFavorites);
    localStorage.setItem(FAVORITE_TIPS_KEY, JSON.stringify(newFavorites));
  };

  const shareTip = async (tip: Tip) => {
    const text = `💡 Conseil Journal EmotionsCare: "${tip.title}" - ${tip.content}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copié!', description: 'Conseil copié dans le presse-papier' });
      }
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: 'Copié!', description: 'Conseil copié dans le presse-papier' });
    }
  };

  return (
    <TooltipProvider>
      <Card className={`border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <currentTip.icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            
            <div className="flex-1 space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{currentTip.title}</h4>
                    {completedTips.includes(currentTip.id) && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Badge variant="outline" className={`text-xs ${difficultyColors[currentTip.difficulty]}`}>
                      {difficultyLabels[currentTip.difficulty]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentTip.content}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleFavorite(currentTip.id)}
                      >
                        {favoriteTips.includes(currentTip.id) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Favoris</TooltipContent>
                  </Tooltip>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleDismiss}
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {currentTip.actionLabel && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => {
                      if (currentTip.actionLink) {
                        window.location.href = currentTip.actionLink;
                      }
                    }}
                  >
                    {currentTip.actionLabel}
                    {currentTip.actionLink && <ExternalLink className="h-3 w-3 ml-1" />}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => toggleComplete(currentTip.id)}
                >
                  {completedTips.includes(currentTip.id) ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                      Maîtrisé
                    </>
                  ) : (
                    'Marquer comme lu'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => shareTip(currentTip)}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Progress & Navigation */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {filteredTips.slice(0, 8).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTipIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentTipIndex % filteredTips.length 
                            ? 'bg-primary w-4' 
                            : 'bg-primary/30 w-1.5'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                    {filteredTips.length > 8 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        +{filteredTips.length - 8}
                      </span>
                    )}
                  </div>
                  
                  <Button
                    variant="link"
                    size="sm"
                    className="h-6 text-xs p-0"
                    onClick={() => setShowAllTips(true)}
                  >
                    Voir tous ({tips.length})
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handlePrevious}
                    aria-label="Conseil précédent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleNext}
                    aria-label="Conseil suivant"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              {completedTips.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{completedTips.length}/{tips.length}</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Tips Dialog */}
      <Dialog open={showAllTips} onOpenChange={setShowAllTips}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Tous les conseils
            </DialogTitle>
            <DialogDescription>
              {completedTips.length}/{tips.length} conseils maîtrisés
            </DialogDescription>
          </DialogHeader>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 pb-4 border-b">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Tips List */}
          <div className="space-y-3">
            {filteredTips.map((tip) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-colors ${
                  completedTips.includes(tip.id) 
                    ? 'bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <tip.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{tip.title}</h4>
                        <Badge variant="outline" className={`text-xs ${difficultyColors[tip.difficulty]}`}>
                          {difficultyLabels[tip.difficulty]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(tip.id)}
                    >
                      {favoriteTips.includes(tip.id) ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleComplete(tip.id)}
                    >
                      <CheckCircle2 className={`h-4 w-4 ${
                        completedTips.includes(tip.id) ? 'text-green-500' : ''
                      }`} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
});

JournalQuickTips.displayName = 'JournalQuickTips';
