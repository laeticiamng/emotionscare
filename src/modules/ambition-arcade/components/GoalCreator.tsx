/**
 * Composant de création d'objectifs Ambition Arcade
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles, Target, X } from 'lucide-react';
import { useCreateGoal } from '../hooks';

const SUGGESTED_TAGS = [
  'bien-être', 'productivité', 'apprentissage', 'fitness', 
  'créativité', 'carrière', 'relations', 'finances'
];

interface GoalCreatorProps {
  onSuccess?: () => void;
}

export const GoalCreator: React.FC<GoalCreatorProps> = ({ onSuccess }) => {
  const [objective, setObjective] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  
  const createGoal = useCreateGoal();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    await createGoal.mutateAsync({
      objective: objective.trim(),
      tags: selectedTags
    });

    setObjective('');
    setSelectedTags([]);
    onSuccess?.();
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
                disabled={createGoal.isPending}
              />
              <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

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
              onClick={() => onSuccess?.()}
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
                  Lancer l'aventure
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
