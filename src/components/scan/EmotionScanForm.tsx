
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import { EmotionResult } from '@/types/emotion';
import { processEmotionForBadges } from '@/lib/gamificationService';
import { useAuth } from '@/contexts/AuthContext';
import TextEmotionScanner from './TextEmotionScanner';
import VoiceEmotionAnalyzer from './VoiceEmotionAnalyzer';
import FacialEmotionScanner from './FacialEmotionScanner';

interface EmotionScanFormProps {
  userId?: string;
  onScanSaved?: () => void;
  onClose?: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({ userId, onScanSaved, onClose }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'face'>('text');
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleEmotionDetected = (scanResult: EmotionResult) => {
    setResult(scanResult);
  };
  
  const handleSave = async () => {
    if (!result || !userId) return;
    
    setIsSaving(true);
    try {
      // Process the emotion for potential badges
      const badges = await processEmotionForBadges(userId, result);
      
      // Show success message
      toast({
        title: "Émotion enregistrée",
        description: `${result.primaryEmotion?.name || result.emotion || 'Émotion'} détectée et enregistrée.`,
        variant: "default"
      });
      
      if (badges.length > 0) {
        toast({
          title: "Badge débloqué !",
          description: `Vous avez débloqué ${badges.length} badge(s) !`,
          variant: "default"
        });
      }
      
      if (onScanSaved) {
        onScanSaved();
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving emotion scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'émotion.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'text' ? 'default' : 'outline'}
            onClick={() => setActiveTab('text')}
          >
            Texte
          </Button>
          <Button
            variant={activeTab === 'voice' ? 'default' : 'outline'}
            onClick={() => setActiveTab('voice')}
          >
            Voix
          </Button>
          <Button
            variant={activeTab === 'face' ? 'default' : 'outline'}
            onClick={() => setActiveTab('face')}
          >
            Visage
          </Button>
        </div>
        
        {activeTab === 'text' && (
          <TextEmotionScanner onEmotionDetected={handleEmotionDetected} />
        )}
        
        {activeTab === 'voice' && (
          <VoiceEmotionAnalyzer onEmotionDetected={handleEmotionDetected} />
        )}
        
        {activeTab === 'face' && (
          <FacialEmotionScanner onEmotionDetected={handleEmotionDetected} />
        )}
        
        {result && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <h3 className="font-semibold mb-2">Résultat de l'analyse</h3>
            <p>Émotion dominante: {result.primaryEmotion?.name || result.emotion}</p>
            <p>Intensité: {result.primaryEmotion?.intensity || result.intensity || 0}</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmotionScanForm;
