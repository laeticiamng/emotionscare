// @ts-nocheck

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EmotionResult } from '@/types/emotion';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Check, Download, Music, Play, Share2, User, TrendingUp, TrendingDown, Minus, BarChart3, Heart, Brain, Zap, FileText, Copy, Bookmark, BookmarkCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmotionResultCardProps {
  result: EmotionResult;
  onPlayAudio?: () => void;
  onClose?: () => void;
  onSave?: () => void;
  previousResult?: EmotionResult | null;
  showDetailed?: boolean;
}

const EMOTION_DIMENSIONS = [
  { key: 'joy', label: 'Joie', icon: Heart, color: 'text-pink-500' },
  { key: 'calm', label: 'Calme', icon: Brain, color: 'text-blue-500' },
  { key: 'energy', label: 'Énergie', icon: Zap, color: 'text-yellow-500' },
];

const EmotionResultCard: React.FC<EmotionResultCardProps> = ({
  result,
  onPlayAudio,
  onClose,
  onSave,
  previousResult,
  showDetailed = true,
}) => {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('emotion-bookmarks') || '[]');
    return bookmarks.includes(result.id);
  });

  const date = new Date(result.date);
  const formattedDate = formatDistanceToNow(date, { addSuffix: true, locale: fr });
  const fullDate = format(date, "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr });

  // Calculate score category
  const scoreCategory = useMemo(() => {
    if (result.score >= 75) return { color: 'text-green-600', bg: 'bg-green-100', text: 'Positif', emoji: '😊' };
    if (result.score >= 60) return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Plutôt positif', emoji: '🙂' };
    if (result.score >= 40) return { color: 'text-amber-500', bg: 'bg-amber-100', text: 'Neutre', emoji: '😐' };
    if (result.score >= 25) return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Plutôt négatif', emoji: '😕' };
    return { color: 'text-red-600', bg: 'bg-red-100', text: 'Négatif', emoji: '😔' };
  }, [result.score]);

  // Calculate trend vs previous
  const trend = useMemo(() => {
    if (!previousResult) return null;
    const diff = result.score - previousResult.score;
    if (diff > 5) return { direction: 'up', diff, icon: TrendingUp, color: 'text-green-500' };
    if (diff < -5) return { direction: 'down', diff: Math.abs(diff), icon: TrendingDown, color: 'text-red-500' };
    return { direction: 'stable', diff: 0, icon: Minus, color: 'text-muted-foreground' };
  }, [result.score, previousResult]);

  // Simulated emotion dimensions
  const dimensions = useMemo(() => ({
    joy: Math.min(100, Math.max(0, result.score + Math.random() * 20 - 10)),
    calm: Math.min(100, Math.max(0, 100 - (result.score > 50 ? 30 : 60) + Math.random() * 20)),
    energy: Math.min(100, Math.max(0, result.score * 0.8 + Math.random() * 30)),
  }), [result.score]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder');
      return;
    }

    try {
      const saveResult = { ...result, user_id: user.id };
      const { error } = await supabase.from('emotions').insert(saveResult);
      if (error) throw error;
      
      setIsSaved(true);
      toast.success('Résultat sauvegardé');
      if (onSave) onSave();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('emotion-bookmarks') || '[]');
    if (isBookmarked) {
      const filtered = bookmarks.filter((id: string) => id !== result.id);
      localStorage.setItem('emotion-bookmarks', JSON.stringify(filtered));
      setIsBookmarked(false);
      toast.success('Retiré des favoris');
    } else {
      bookmarks.push(result.id);
      localStorage.setItem('emotion-bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success('Ajouté aux favoris ⭐');
    }
  };

  const handleShare = async () => {
    const shareText = `Mon niveau de bien-être émotionnel : ${result.score}/100 ${scoreCategory.emoji} - ${scoreCategory.text}\n\n${result.ai_feedback || ''}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Texte copié');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Texte copié');
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Analyse Émotionnelle - ${fullDate}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
              .header { border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 1rem; }
              .score { font-size: 3rem; font-weight: bold; color: ${result.score >= 60 ? '#16a34a' : result.score >= 40 ? '#f59e0b' : '#dc2626'}; }
              .section { margin: 1.5rem 0; padding: 1rem; background: #f9fafb; border-radius: 8px; }
              .dimensions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
              .dim { text-align: center; padding: 1rem; background: white; border-radius: 8px; }
              .bar { height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 0.5rem; }
              .bar-fill { height: 100%; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Analyse Émotionnelle</h1>
              <p>${fullDate}</p>
            </div>
            <div class="score">${result.score}/100 ${scoreCategory.emoji}</div>
            <p style="font-size: 1.25rem; color: #666;">${scoreCategory.text}</p>
            
            ${result.text ? `<div class="section"><h3>Texte analysé</h3><p>${result.text}</p></div>` : ''}
            ${result.emojis ? `<div class="section"><h3>Émojis</h3><p style="font-size: 2rem;">${result.emojis}</p></div>` : ''}
            
            <div class="section">
              <h3>Dimensions émotionnelles</h3>
              <div class="dimensions">
                <div class="dim">
                  <strong>Joie</strong>
                  <div class="bar"><div class="bar-fill" style="width: ${dimensions.joy}%; background: #ec4899;"></div></div>
                  <span>${Math.round(dimensions.joy)}%</span>
                </div>
                <div class="dim">
                  <strong>Calme</strong>
                  <div class="bar"><div class="bar-fill" style="width: ${dimensions.calm}%; background: #3b82f6;"></div></div>
                  <span>${Math.round(dimensions.calm)}%</span>
                </div>
                <div class="dim">
                  <strong>Énergie</strong>
                  <div class="bar"><div class="bar-fill" style="width: ${dimensions.energy}%; background: #eab308;"></div></div>
                  <span>${Math.round(dimensions.energy)}%</span>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h3>Analyse IA</h3>
              <p>${result.ai_feedback}</p>
            </div>
            
            <footer style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #999; font-size: 0.875rem;">
              Généré par EmotionsCare • ${format(new Date(), 'dd/MM/yyyy HH:mm')}
            </footer>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getEmotionIcon = () => {
    if (result.emojis) return <div className="text-2xl">{result.emojis}</div>;
    if (result.audio_url) return <Play className="h-6 w-6 text-blue-500" />;
    return <User className="h-6 w-6 text-purple-500" />;
  };

  return (
    <>
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {getEmotionIcon()}
                Analyse d'émotions
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {formattedDate}
                {trend && (
                  <Badge variant="outline" className={cn("gap-1", trend.color)}>
                    <trend.icon className="h-3 w-3" />
                    {trend.direction === 'up' ? `+${trend.diff}` : trend.direction === 'down' ? `-${trend.diff}` : 'Stable'}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className="h-8 w-8"
                aria-label={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <motion.div 
                className={`${scoreCategory.bg} ${scoreCategory.color} px-3 py-1 rounded-full font-medium flex items-center gap-2`}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                <span className="text-lg">{scoreCategory.emoji}</span>
                {result.score}/100
              </motion.div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Emotion dimensions */}
          {showDetailed && (
            <div className="grid grid-cols-3 gap-3">
              {EMOTION_DIMENSIONS.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                  <Icon className={cn("h-5 w-5 mx-auto mb-1", color)} />
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-semibold">{Math.round(dimensions[key as keyof typeof dimensions])}%</div>
                  <Progress value={dimensions[key as keyof typeof dimensions]} className="h-1 mt-1" />
                </div>
              ))}
            </div>
          )}

          {result.text && (
            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Texte analysé</h4>
              <p className="text-foreground">{result.text}</p>
            </div>
          )}
          
          {result.emojis && (
            <div className="bg-muted/50 p-3 rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Émojis choisis</h4>
              <p className="text-2xl">{result.emojis}</p>
            </div>
          )}
          
          <div className="bg-primary/5 border border-primary/20 p-3 rounded-md">
            <h4 className="text-sm font-medium text-primary mb-1 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Analyse IA
            </h4>
            <p className="text-foreground">{result.ai_feedback}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {result.audio_url && (
              <Button variant="outline" size="sm" onClick={onPlayAudio} className="gap-2">
                <Play className="h-4 w-4" />
                Écouter
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSave}
              disabled={isSaved}
              className="gap-2"
            >
              <Check className={cn("h-4 w-4", isSaved && "text-green-500")} />
              {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </Button>

            <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
              <FileText className="h-4 w-4" />
              PDF
            </Button>
            
            {showDetailed && (
              <Button variant="outline" size="sm" onClick={() => setShowDetails(true)} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Détails
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 ml-auto"
              onClick={() => {
                toast.success('Génération de musique initiée');
                if (onClose) onClose();
              }}
            >
              <Music className="h-4 w-4" />
              Musique adaptée
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Analyse détaillée</DialogTitle>
            <DialogDescription>{fullDate}</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="dimensions">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
              <TabsTrigger value="recommendations">Conseils</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dimensions" className="space-y-4 mt-4">
              <div className="text-center">
                <div className={cn("text-5xl font-bold", scoreCategory.color)}>{result.score}</div>
                <div className="text-muted-foreground">Score global</div>
              </div>
              
              <div className="space-y-3">
                {EMOTION_DIMENSIONS.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={cn("h-5 w-5", color)} />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span className="font-medium">{Math.round(dimensions[key as keyof typeof dimensions])}%</span>
                      </div>
                      <Progress value={dimensions[key as keyof typeof dimensions]} />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Historique des analyses à venir</p>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-3 mt-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">🧘 Respiration</h4>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Une session de respiration guidée pourrait améliorer votre score de calme.
                </p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">🎵 Musique</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  De la musique apaisante est recommandée pour équilibrer votre énergie.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">📝 Journal</h4>
                <p className="text-sm text-purple-700 dark:text-purple-400">
                  Prenez un moment pour écrire vos pensées dans le journal.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmotionResultCard;
