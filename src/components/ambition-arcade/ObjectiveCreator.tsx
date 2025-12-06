import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Sparkles, 
  Calendar,
  Zap,
  Plus,
  X
} from 'lucide-react';

interface ObjectiveCreatorProps {
  onCreateObjective: (objective: string, timeframe: string, difficulty: string, tags: string[]) => void;
  isLoading: boolean;
}

const ObjectiveCreator: React.FC<ObjectiveCreatorProps> = ({ 
  onCreateObjective, 
  isLoading 
}) => {
  const [objective, setObjective] = useState('');
  const [timeframe, setTimeframe] = useState('30');
  const [difficulty, setDifficulty] = useState('medium');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const handleSubmit = () => {
    if (objective.trim()) {
      onCreateObjective(objective, timeframe, difficulty, tags);
      // Réinitialiser le formulaire
      setObjective('');
      setTimeframe('30');
      setDifficulty('medium');
      setTags([]);
      setNewTag('');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const difficultyOptions = [
    { value: 'easy', label: 'Facile', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'hard', label: 'Difficile', color: 'bg-red-100 text-red-800' }
  ];

  const presetObjectives = [
    'Apprendre une nouvelle compétence',
    'Améliorer ma forme physique',
    'Développer un projet personnel',
    'Renforcer mes relations sociales',
    'Organiser mon espace de travail'
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          Créer un Objectif Gamifié
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Objectif principal */}
        <div className="space-y-2">
          <Label htmlFor="objective">Objectif principal</Label>
          <Textarea
            id="objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Décrivez votre objectif en quelques mots..."
            className="min-h-20"
          />
          <div className="text-xs text-muted-foreground">
            Soyez précis et motivant. Ex: "Maîtriser React en créant 3 projets concrets"
          </div>
        </div>

        {/* Suggestions rapides */}
        <div className="space-y-2">
          <Label>Suggestions rapides</Label>
          <div className="flex flex-wrap gap-2">
            {presetObjectives.map((preset, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => setObjective(preset)}
                className="text-xs"
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Durée */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="timeframe">Délai (en jours)</Label>
            <Input
              id="timeframe"
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              min="1"
              max="365"
            />
          </div>

          {/* Difficulté */}
          <div className="space-y-2">
            <Label>Niveau de difficulté</Label>
            <div className="grid grid-cols-3 gap-1">
              {difficultyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={difficulty === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDifficulty(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags et catégories</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag..."
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1"
            />
            <Button onClick={addTag} size="icon" variant="outline" aria-label="Ajouter le tag">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="gap-1">
                  {tag}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeTag(tag)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Aperçu de la gamification */}
        <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium">Aperçu de la gamification</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Durée: {timeframe} jours</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>
                Difficulté: {difficultyOptions.find(d => d.value === difficulty)?.label}
              </span>
            </div>
            <div>
              <span>XP estimé: {Math.floor(parseInt(timeframe) * (difficulty === 'hard' ? 15 : difficulty === 'medium' ? 10 : 5))} points</span>
            </div>
          </div>
        </div>

        {/* Bouton de création */}
        <Button 
          onClick={handleSubmit}
          disabled={!objective.trim() || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              Génération des quêtes...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Créer l'Objectif Gamifié
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ObjectiveCreator;