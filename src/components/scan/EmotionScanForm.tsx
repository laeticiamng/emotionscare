
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Music, Activity, MessageSquare } from 'lucide-react';
import { EmotionResult } from '@/types/emotion';
import TextEmotionScanner from './TextEmotionScanner';
import EmojiEmotionScanner from './EmojiEmotionScanner';
import FacialEmotionScanner from './FacialEmotionScanner';
import LiveVoiceScanner from './LiveVoiceScanner';

export interface EmotionScanFormProps {
  onScanComplete?: (result: EmotionResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const EmotionScanForm: React.FC<EmotionScanFormProps> = ({
  onScanComplete,
  onCancel,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<string>('emoji');
  const [scanning, setScanning] = useState(false);
  
  const handleScanComplete = (result: EmotionResult) => {
    setScanning(false);
    if (onScanComplete) {
      onScanComplete(result);
    }
  };
  
  const handleCancel = () => {
    setScanning(false);
    if (onCancel) {
      onCancel();
    }
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Comment vous sentez-vous aujourd'hui ?</CardTitle>
        <CardDescription>
          Choisissez une méthode pour analyser votre état émotionnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(value) => setActiveTab(value as "emoji" | "text" | "facial" | "voice")}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="emoji" disabled={scanning}>
              <span className="hidden md:inline mr-2">Emoji</span>
              <PlusCircle className="h-4 w-4 md:mr-0" />
            </TabsTrigger>
            <TabsTrigger value="text" disabled={scanning}>
              <span className="hidden md:inline mr-2">Texte</span>
              <MessageSquare className="h-4 w-4 md:mr-0" />
            </TabsTrigger>
            <TabsTrigger value="facial" disabled={scanning}>
              <span className="hidden md:inline mr-2">Visage</span>
              <Activity className="h-4 w-4 md:mr-0" />
            </TabsTrigger>
            <TabsTrigger value="voice" disabled={scanning}>
              <span className="hidden md:inline mr-2">Voix</span>
              <Music className="h-4 w-4 md:mr-0" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="emoji">
            <EmojiEmotionScanner
              onScanComplete={handleScanComplete}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="text">
            <TextEmotionScanner
              onScanComplete={handleScanComplete}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="facial">
            <FacialEmotionScanner
              onScanComplete={handleScanComplete}
              onCancel={handleCancel}
            />
          </TabsContent>
          
          <TabsContent value="voice">
            <LiveVoiceScanner
              onScanComplete={handleScanComplete}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={handleCancel}>
          Annuler
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmotionScanForm;
