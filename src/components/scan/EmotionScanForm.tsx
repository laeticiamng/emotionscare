
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { saveEmotionScan } from '@/lib/scanService';
import { useAuth } from '@/contexts/AuthContext';
import type { Emotion } from '@/types';

interface EmotionScanFormProps {
  onScanSaved: (scan: Emotion) => void;
}

const EmotionScanForm = ({ onScanSaved }: EmotionScanFormProps) => {
  const [mood, setMood] = useState<number>(75);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Create new emotion entry
      const newScan: Omit<Emotion,'id'> = {
        date: new Date().toISOString(),
        score: mood,
        text: notes.trim() || '',
        user_id: user?.id || '00000000-0000-0000-0000-000000000000' // Use current user ID or a default ID
      };
      
      const savedEmotion = await saveEmotionScan(newScan);
      
      onScanSaved(savedEmotion);
      
      toast({
        title: "Scan enregistré",
        description: "Votre scan émotionnel a été enregistré avec succès"
      });
      
      // Reset the notes field after saving
      setNotes('');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le scan: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span className="font-medium">{mood}/100</span>
            <span>100</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 font-medium">Quelques notes (optionnel)</label>
          <Textarea
            rows={3}
            placeholder="Écrivez quelques mots sur votre état..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Enregistrement...' : 'Sauvegarder'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmotionScanForm;
