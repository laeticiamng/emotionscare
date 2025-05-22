
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, PlusCircle } from 'lucide-react';
import Shell from '@/Shell';
import { addJournalEntry } from '@/lib/journalService';
import { JournalEntry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import EmotionSelector from '@/components/journal/EmotionSelector';
import { Slider } from '@/components/ui/slider';
import { getEmotionIcon, getEmotionColor, getEmotionIntensityDescription } from '@/lib/emotionUtils';

const NewJournalEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // États du formulaire
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [moodScore, setMoodScore] = useState(50);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const handleSave = async () => {
    // Validation de base
    if (!title.trim()) {
      toast.error("Veuillez ajouter un titre");
      return;
    }
    
    if (!selectedEmotion) {
      toast.error("Veuillez sélectionner une émotion");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Veuillez ajouter du contenu");
      return;
    }
    
    try {
      setIsSaving(true);
      
      const newEntry: Omit<JournalEntry, 'id'> = {
        title,
        content,
        emotion: selectedEmotion,
        mood: selectedEmotion, // Pour compatibilité
        mood_score: moodScore,
        tags,
        date: new Date().toISOString(),
        user_id: user?.id || 'user1' // Utiliser un ID par défaut pour les tests
      };
      
      const createdEntry = await addJournalEntry(newEntry);
      toast.success("Entrée de journal créée avec succès");
      navigate(`/journal/${createdEntry.id}`);
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Échec de la création de l'entrée");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  return (
    <Shell>
      <div className="container py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour
        </Button>
        
        <Card className="shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle>Nouvelle entrée de journal</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l'entrée"
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Comment vous sentez-vous aujourd'hui ?</Label>
                <EmotionSelector
                  selectedEmotion={selectedEmotion}
                  onSelectEmotion={setSelectedEmotion}
                />
              </div>
              
              {selectedEmotion && (
                <div className="space-y-4 mt-2">
                  <Label htmlFor="mood-intensity" className="flex justify-between">
                    <span>Intensité de l'émotion</span>
                    <span className="text-primary">{moodScore}/100</span>
                  </Label>
                  <Slider
                    id="mood-intensity"
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    value={[moodScore]}
                    onValueChange={(values) => setMoodScore(values[0])}
                    className="py-4"
                  />
                  
                  <div className="p-4 rounded-lg bg-muted flex items-start gap-3">
                    <div className={`text-4xl ${getEmotionColor(selectedEmotion)}`}>
                      {getEmotionIcon(selectedEmotion)}
                    </div>
                    <div>
                      <p className="font-medium">
                        Vous vous sentez {selectedEmotion}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Intensité: {getEmotionIntensityDescription(selectedEmotion, Math.round(moodScore/20))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Décrivez votre journée et vos émotions..."
                className="min-h-[200px]"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1">
                    {tag}
                    <button
                      className="ml-1 rounded-full hover:bg-primary/20 p-0.5"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <span className="sr-only">Supprimer</span>
                      <Trash2 size={14} />
                    </button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">Ajoutez des tags pour mieux organiser vos entrées</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                  className="flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-muted/30 p-4">
            <div className="w-full flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
                size="lg"
              >
                {isSaving ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sauvegarde en cours...
                  </div>
                ) : (
                  <>
                    <Save size={16} />
                    Enregistrer l'entrée
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
};

export default NewJournalEntryPage;
