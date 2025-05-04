
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createJournalEntry } from '@/lib/journalService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// List of journal prompts to help users get started
const journalPrompts = [
  "Comment vous sentez-vous aujourd'hui et pourquoi ?",
  "Qu'est-ce qui vous a apporté de la joie aujourd'hui ?",
  "Quels défis avez-vous rencontrés et comment les avez-vous gérés ?",
  "Décrivez une interaction significative que vous avez eue avec un patient.",
  "Quelles sont vos préoccupations professionnelles actuelles ?",
  "Comment prenez-vous soin de votre bien-être aujourd'hui ?",
  "Quelles leçons avez-vous apprises récemment dans votre pratique ?",
  "Quels sont vos objectifs pour demain ou la semaine à venir ?",
  "Qu'est-ce qui vous a surpris aujourd'hui dans votre travail ?",
  "Comment votre humeur a-t-elle affecté votre journée de travail ?"
];

const JournalNewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('🙂');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleRandomPrompt = () => {
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    setContent(prev => {
      if (prev.trim()) return `${prev}\n\n${randomPrompt}`;
      return randomPrompt;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Contenu requis",
        description: "Veuillez écrire quelque chose dans votre journal.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const keywords = keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);
      
      await createJournalEntry(
        user?.id || '',
        content,
        mood as any,
        keywords.length > 0 ? keywords : undefined
      );
      
      toast({
        title: "Entrée de journal créée",
        description: "Votre entrée a été enregistrée avec succès."
      });
      
      navigate('/journal');
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'entrée de journal.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate('/journal')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={18} /> Retour au journal
      </Button>
      
      <h1 className="text-3xl font-bold mb-6">Nouvelle entrée de journal</h1>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="mood">Votre humeur</Label>
                <Select 
                  value={mood} 
                  onValueChange={setMood}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre humeur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="😃">😃 Très bien</SelectItem>
                    <SelectItem value="🙂">🙂 Bien</SelectItem>
                    <SelectItem value="😐">😐 Neutre</SelectItem>
                    <SelectItem value="🙁">🙁 Pas bien</SelectItem>
                    <SelectItem value="😢">😢 Très mal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content">Qu'avez-vous en tête ?</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleRandomPrompt}
                  >
                    Idée de prompt
                  </Button>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Écrivez votre entrée de journal ici..."
                  className="min-h-[200px] resize-y"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
                <Input
                  id="keywords"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="stress, fatigue, motivation, etc."
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? "Enregistrement..." : "Enregistrer l'entrée"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default JournalNewPage;
