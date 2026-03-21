/**
 * Composant de création d'objectifs Ambition Arcade avec génération IA
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Sparkles, Target, X, Wand2 } from 'lucide-react';
import { useCreateGoal, useCreateQuest } from '../hooks';
import { supabase } from '@/integrations/supabase/client';
import { SUPABASE_URL } from '@/lib/env';
import { useToast } from '@/hooks/use-toast';
import { useConfetti } from '../hooks/useConfetti';

const SUGGESTED_TAGS = [
  'bien-être', 'productivité', 'apprentissage', 'fitness', 
  'créativité', 'carrière', 'relations', 'finances'
];

interface GoalCreatorProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface GameLevel {
  name: string;
  description: string;
  points: number;
  tasks: string[];
}

interface GameStructure {
  levels: GameLevel[];
  totalPoints: number;
  badges: string[];
}

export const GoalCreator: React.FC<GoalCreatorProps> = ({ onSuccess, onCancel }) => {
  const [objective, setObjective] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeframe, setTimeframe] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStructure, setGeneratedStructure] = useState<GameStructure | null>(null);
  
  const createGoal = useCreateGoal();
  const createQuest = useCreateQuest();
  const { toast } = useToast();
  const { fireAchievementConfetti } = useConfetti();

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleGenerateWithAI = async () => {
    if (!objective.trim()) return;

    setIsGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/ambition-arcade`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            goal: objective.trim(),
            timeframe,
            difficulty,
          }),
        }
      );

      const data = await response.json();
      
      if (data.gameStructure) {
        setGeneratedStructure(data.gameStructure);
        toast({
          title: '✨ Structure générée !',
          description: `${data.gameStructure.levels.length} niveaux créés par l'IA`,
        });
      } else {
        throw new Error(data.error || 'Erreur de génération');
      }
    } catch (error) {
      console.error('Error generating structure:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer la structure',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    try {
      // Créer l'objectif
      const newGoal = await createGoal.mutateAsync({
        objective: objective.trim(),
        tags: selectedTags
      });

      // Si une structure a été générée, créer les quêtes automatiquement
      if (generatedStructure && newGoal) {
        for (const level of generatedStructure.levels) {
          for (const task of level.tasks) {
            await createQuest.mutateAsync({
              runId: newGoal.id,
              title: task,
              flavor: level.name,
              xpReward: Math.round(level.points / level.tasks.length),
              estMinutes: 15
            });
          }
        }
        
        fireAchievementConfetti();
        toast({
          title: '🎮 Aventure lancée !',
          description: `${generatedStructure.levels.reduce((sum, l) => sum + l.tasks.length, 0)} quêtes créées`,
        });
      }

      setObjective('');
      setSelectedTags([]);
      setGeneratedStructure(null);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Nouvel Objectif
        </CardTitle>
        <CardDescription>
          Définissez votre prochain défi et transformez-le en aventure
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Objective Input */}
          <div className="space-y-2">
            <Label htmlFor="objective">Quel est votre objectif ?</Label>
            <div className="relative">
              <Input
                id="objective"
                placeholder="Ex: Apprendre une nouvelle compétence en 30 jours"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="pr-10"
                disabled={createGoal.isPending || isGenerating}
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* AI Generation Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as 'easy' | 'medium' | 'hard')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">🌱 Facile</SelectItem>
                  <SelectItem value="medium">⚡ Moyen</SelectItem>
                  <SelectItem value="hard">🔥 Difficile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Délai (jours)</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="14">14 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="60">60 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate with AI Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={handleGenerateWithAI}
            disabled={!objective.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Générer une structure avec l'IA
              </>
            )}
          </Button>

          {/* Generated Structure Preview */}
          {generatedStructure && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Structure générée</h4>
                <Badge variant="secondary">
                  {generatedStructure.totalPoints} XP total
                </Badge>
              </div>
              <div className="space-y-2">
                {generatedStructure.levels.map((level, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className="shrink-0">Niv. {idx + 1}</Badge>
                    <span className="text-muted-foreground">{level.name}</span>
                    <span className="text-xs text-muted-foreground">({level.tasks.length} tâches)</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {generatedStructure.badges.slice(0, 3).map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Catégories (optionnel)</Label>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_TAGS.map(tag => (
                <motion.div
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer transition-all"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Custom Tag */}
          <div className="flex gap-2">
            <Input
              placeholder="Ajouter un tag personnalisé"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomTag())}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Custom Tags */}
          {selectedTags.filter(t => !SUGGESTED_TAGS.includes(t)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.filter(t => !SUGGESTED_TAGS.includes(t)).map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-destructive" 
                    onClick={() => handleTagToggle(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onCancel?.()}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={!objective.trim() || createGoal.isPending}
            >
              {createGoal.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  {generatedStructure ? 'Lancer l\'aventure' : 'Créer l\'objectif'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GoalCreator;
