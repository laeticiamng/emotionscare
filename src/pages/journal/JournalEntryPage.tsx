
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Shell from '@/Shell';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getJournalEntryById, updateJournalEntry, deleteJournalEntry } from '@/lib/journalService';
import { JournalEntry } from '@/types';
import EmotionSelector from '@/components/journal/EmotionSelector';
import { getEmotionIcon, getEmotionColor, getEmotionIntensityDescription } from '@/lib/emotionUtils';

const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // États de modification
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [moodScore, setMoodScore] = useState(50);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  useEffect(() => {
    const loadEntry = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getJournalEntryById(id);
        
        if (data) {
          setEntry(data);
          setTitle(data.title);
          setContent(data.content);
          setSelectedEmotion(data.emotion || data.mood || 'neutral');
          setMoodScore(data.mood_score || 50);
          setTags(data.tags || []);
        } else {
          toast.error("Cette entrée de journal n'existe pas");
          navigate('/journal');
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'entrée:", error);
        toast.error("Impossible de charger cette entrée");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntry();
  }, [id, navigate]);
  
  const handleSave = async () => {
    if (!entry) return;
    
    try {
      setIsSaving(true);
      
      const updatedEntry: JournalEntry = {
        ...entry,
        title,
        content,
        emotion: selectedEmotion,
        mood: selectedEmotion, // Pour compatibilité
        mood_score: moodScore,
        tags
      };
      
      await updateJournalEntry(updatedEntry);
      toast.success("Entrée de journal mise à jour");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Échec de la mise à jour");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!entry || !window.confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;
    
    try {
      setIsDeleting(true);
      await deleteJournalEntry(entry.id);
      toast.success("Entrée de journal supprimée");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Échec de la suppression");
      setIsDeleting(false);
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
  
  if (isLoading) {
    return (
      <Shell>
        <div className="container py-8 flex justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Shell>
    );
  }
  
  if (!entry) {
    return (
      <Shell>
        <div className="container py-8">
          <div className="text-center p-8 border rounded-md border-dashed bg-muted/20">
            <p className="text-muted-foreground">Entrée de journal non trouvée</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Retour au tableau de bord
            </Button>
          </div>
        </div>
      </Shell>
    );
  }
  
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
            <div className="flex justify-between items-center">
              <CardTitle>Modifier l'entrée du journal</CardTitle>
              <div className="text-sm text-muted-foreground">
                {format(new Date(entry.date), 'PPP', { locale: fr })}
              </div>
            </div>
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
            
            <div className="space-y-2">
              <Label>Émotion ressentie</Label>
              <div className="bg-accent/50 p-4 rounded-lg">
                <EmotionSelector
                  selectedEmotion={selectedEmotion}
                  onSelectEmotion={setSelectedEmotion}
                />
              </div>
              
              {selectedEmotion && (
                <div className="flex items-center mt-4 p-3 bg-muted rounded-lg">
                  <div className={`text-4xl ${getEmotionColor(selectedEmotion)}`}>
                    {getEmotionIcon(selectedEmotion)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Vous vous sentez {selectedEmotion}</p>
                    <p className="text-sm text-muted-foreground">
                      Intensité: {getEmotionIntensityDescription(selectedEmotion, Math.round(moodScore/20))}
                    </p>
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
                  <span className="text-sm text-muted-foreground">Aucun tag ajouté</span>
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
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t bg-muted/30 p-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                  Suppression...
                </div>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Supprimer
                </>
              )}
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving || isDeleting}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sauvegarde...
                </div>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Shell>
  );
};

export default JournalEntryPage;
