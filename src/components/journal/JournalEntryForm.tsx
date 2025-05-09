
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { analyzeEmotionalJournal } from '@/lib/ai/journal-service';
import { useToast } from '@/hooks/use-toast';

interface JournalEntryFormProps {
  onSubmit: (data: any) => void;
  isSaving: boolean;
  initialValues?: {
    title?: string;
    content?: string;
    mood?: string;
    date?: string;
  };
}

const moodOptions = [
  { value: 'happy', label: 'Heureux' },
  { value: 'sad', label: 'Triste' },
  { value: 'anxious', label: 'Anxieux' },
  { value: 'calm', label: 'Calme' },
  { value: 'angry', label: 'En colère' },
  { value: 'excited', label: 'Excité' },
  { value: 'neutral', label: 'Neutre' },
  { value: 'frustrated', label: 'Frustré' },
  { value: 'tired', label: 'Fatigué' },
  { value: 'stressed', label: 'Stressé' }
];

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onSubmit, isSaving, initialValues = {} }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: initialValues.title || '',
      content: initialValues.content || '',
      mood: initialValues.mood || 'neutral',
      date: initialValues.date || new Date().toISOString().split('T')[0]
    }
  });
  
  const content = watch('content');
  
  const handleAnalyze = async () => {
    if (!content || content.length < 10) {
      toast({
        title: "Texte trop court",
        description: "Veuillez écrire un peu plus pour obtenir une analyse.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeEmotionalJournal(content);
      setAiFeedback(result.message);
      
      // Auto-set mood if detected
      if (result.detectedEmotion) {
        const lowerEmotion = result.detectedEmotion.toLowerCase();
        const matchedMood = moodOptions.find(
          option => lowerEmotion.includes(option.value)
        );
        
        if (matchedMood) {
          setValue('mood', matchedMood.value);
        }
      }
      
      toast({
        title: "Analyse terminée",
        description: "L'IA a analysé votre entrée de journal."
      });
    } catch (error) {
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser votre texte pour le moment.",
        variant: "destructive"
      });
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleFormSubmit = (data: any) => {
    // Calculate mood score based on selected mood
    let moodScore = 50; // Neutral default
    
    switch (data.mood) {
      case 'happy':
      case 'excited':
        moodScore = 80;
        break;
      case 'calm':
        moodScore = 70;
        break;
      case 'neutral':
        moodScore = 50;
        break;
      case 'frustrated':
      case 'tired':
      case 'stressed':
        moodScore = 40;
        break;
      case 'sad':
      case 'anxious':
      case 'angry':
        moodScore = 20;
        break;
    }
    
    // Prepare final data including AI feedback if available
    const finalData = {
      ...data,
      mood_score: moodScore,
      ai_feedback: aiFeedback,
      created_at: new Date().toISOString()
    };
    
    onSubmit(finalData);
  };
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          type="date" 
          {...register("date", { required: "La date est requise" })}
        />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message as string}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input 
          id="title" 
          placeholder="Un titre pour votre entrée" 
          {...register("title", { required: "Le titre est requis" })}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message as string}</p>}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="content">Contenu</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAnalyze}
            disabled={!content || content.length < 10 || isAnalyzing}
          >
            {isAnalyzing ? 'Analyse en cours...' : 'Analyser avec IA'}
          </Button>
        </div>
        <Textarea 
          id="content" 
          placeholder="Partagez vos pensées et émotions..." 
          rows={6}
          {...register("content", { required: "Le contenu est requis" })}
        />
        {errors.content && <p className="text-sm text-destructive">{errors.content.message as string}</p>}
      </div>
      
      {aiFeedback && (
        <Card className="p-4 bg-secondary/40">
          <p className="text-sm font-medium mb-1">Analyse IA :</p>
          <p className="text-sm">{aiFeedback}</p>
        </Card>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="mood">Humeur</Label>
        <Select
          defaultValue={initialValues.mood || "neutral"}
          onValueChange={(value) => setValue("mood", value)}
        >
          <SelectTrigger id="mood">
            <SelectValue placeholder="Sélectionnez votre humeur" />
          </SelectTrigger>
          <SelectContent>
            {moodOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer l\'entrée'}
        </Button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
