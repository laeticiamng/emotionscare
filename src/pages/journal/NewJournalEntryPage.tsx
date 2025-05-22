
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { addJournalEntry } from '@/lib/journalService';
import { toast } from 'sonner';
import { JournalEntry } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import EmotionSelector from '@/components/journal/EmotionSelector';

const NewJournalEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [moodScore, setMoodScore] = useState(50);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Veuillez remplir les champs titre et contenu');
      return;
    }
    
    setLoading(true);
    
    try {
      const newEntry: Omit<JournalEntry, 'id'> = {
        title,
        content,
        mood,
        mood_score: moodScore,
        date: new Date().toISOString(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        user_id: user?.id || 'guest'
      };
      
      await addJournalEntry(newEntry);
      
      toast.success('Entrée de journal ajoutée avec succès');
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la création de l\'entrée:', error);
      toast.error('Erreur lors de la création de l\'entrée');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Donnez un titre à cette entrée"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label>Émotion dominante</Label>
              <EmotionSelector
                selectedEmotion={mood}
                onSelectEmotion={setMood}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="mood-score">
                Intensité de l'émotion ({moodScore}/100)
              </Label>
              <Slider
                id="mood-score"
                min={0}
                max={100}
                step={1}
                value={[moodScore]}
                onValueChange={(values) => setMoodScore(values[0])}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                placeholder="Écrivez vos pensées et sentiments..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input
                id="tags"
                placeholder="travail, famille, sport, ..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewJournalEntryPage;
