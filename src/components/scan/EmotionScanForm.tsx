
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { saveEmotionScan } from '@/lib/scanService';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from "@/components/ui/progress";
import type { Emotion } from '@/types';

interface EmotionScanFormProps {
  onScanSaved: (scan: Emotion) => void;
}

const EmotionScanForm = ({ onScanSaved }: EmotionScanFormProps) => {
  const [mood, setMood] = useState<number>(75);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer un scan",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Simulation d'analyse progressive
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create new emotion entry
      const newScan = {
        date: new Date().toISOString(),
        score: mood,
        text: notes.trim() || '',
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        emotion: mood >= 70 ? 'happy' : mood >= 40 ? 'neutral' : 'sad', // Convertir le score en émotion
        intensity: Math.ceil(mood / 10) // Convertir le score en intensité (1-10)
      };
      
      const savedEmotion = await saveEmotionScan(newScan);
      
      // Finaliser la progression
      setProgress(100);
      clearInterval(progressInterval);
      
      onScanSaved(savedEmotion);
      
      toast({
        title: "Scan enregistré",
        description: "Votre scan émotionnel a été enregistré avec succès"
      });
      
      // Reset the notes field after saving
      setNotes('');
      setProgress(0);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le scan: ${error.message}`,
        variant: "destructive"
      });
      setProgress(0);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500); // Petit délai pour que l'utilisateur voie la progression à 100%
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">🧠 Votre scan du jour</h2>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Comment vous sentez-vous aujourd'hui ?</label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[mood]}
            onValueChange={(values) => setMood(values[0])}
            className="w-full mb-2"
            aria-label="Niveau d'humeur"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span className="font-medium">{mood}/100</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="emotion-notes" className="block mb-2 font-medium">
            Quelques notes (optionnel)
          </label>
          <Textarea
            id="emotion-notes"
            rows={3}
            placeholder="Écrivez quelques mots sur votre état..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notes sur votre état émotionnel"
          />
        </div>
        
        {loading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Analyse en cours...</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" aria-label="Progression de l'analyse" />
          </div>
        )}
        
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={loading}
          aria-label="Sauvegarder le scan émotionnel"
        >
          {loading ? 'Analyse en cours...' : 'Sauvegarder'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
