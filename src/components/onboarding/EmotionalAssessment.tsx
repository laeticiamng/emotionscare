
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmotionalAssessmentProps {
  onContinue: () => void;
  onBack: () => void;
  onResponse: (key: string, value: any) => void;
  loading: boolean;
}

const EmotionalAssessment: React.FC<EmotionalAssessmentProps> = ({ 
  onContinue, 
  onBack,
  onResponse,
  loading
}) => {
  const [journalEntry, setJournalEntry] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');
  const [emotionIntensity, setEmotionIntensity] = useState<number>(50);
  
  const handleSubmit = () => {
    onResponse('emotional_assessment', {
      journal_entry: journalEntry,
      self_reported_emotion: emotion,
      self_reported_intensity: emotionIntensity
    });
    
    onContinue();
  };
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Votre profil émotionnel
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Pour vous offrir une expérience personnalisée, nous aimerions mieux comprendre votre état émotionnel actuel.
        </p>
      </motion.div>
      
      <Card>
        <CardContent className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Label htmlFor="journal-entry" className="text-lg font-medium mb-2 block">
              Comment vous sentez-vous aujourd'hui ?
            </Label>
            <Textarea
              id="journal-entry"
              placeholder="Décrivez librement vos pensées et émotions actuelles..."
              className="min-h-32 text-base"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Cette information nous aide à personnaliser votre expérience. Elle reste entièrement confidentielle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Label htmlFor="emotion" className="text-base font-medium">
                Émotion principale ressentie
              </Label>
              <Select 
                onValueChange={(value) => {
                  setEmotion(value);
                  onResponse('primary_emotion', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une émotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="joy">Joie</SelectItem>
                  <SelectItem value="calm">Calme</SelectItem>
                  <SelectItem value="focus">Concentration</SelectItem>
                  <SelectItem value="energetic">Énergie</SelectItem>
                  <SelectItem value="sad">Tristesse</SelectItem>
                  <SelectItem value="anxiety">Anxiété</SelectItem>
                  <SelectItem value="stress">Stress</SelectItem>
                  <SelectItem value="tired">Fatigue</SelectItem>
                  <SelectItem value="neutral">Neutre</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Label className="text-base font-medium">
                Intensité de cette émotion
              </Label>
              <div className="py-4">
                <Slider 
                  min={0} 
                  max={100}
                  step={1}
                  value={[emotionIntensity]}
                  onValueChange={(values) => {
                    setEmotionIntensity(values[0]);
                    onResponse('emotion_intensity', values[0]);
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Faible</span>
                <span>Moyenne</span>
                <span>Élevée</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={loading}
          className="min-w-32"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              Analyse...
            </>
          ) : (
            'Continuer'
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmotionalAssessment;
