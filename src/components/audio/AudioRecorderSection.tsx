import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Save, Trash } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AudioRecorderSection: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingName, setRecordingName] = useState('');
  const [hasRecording, setHasRecording] = useState(false);
  const { toast } = useToast();
  
  // Timer effect for recording time
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecording(true);
    } else {
      setRecordingTime(0);
      setIsRecording(true);
      setHasRecording(false);
    }
  };
  
  const handleSave = () => {
    if (!recordingName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez nommer votre enregistrement avant de le sauvegarder.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate saving
    toast({
      title: "Enregistrement sauvegardé",
      description: `"${recordingName}" a été sauvegardé avec succès.`,
    });
    
    // Reset state
    setRecordingName('');
    setHasRecording(false);
    setRecordingTime(0);
  };
  
  const handleCancel = () => {
    setHasRecording(false);
    setRecordingTime(0);
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Enregistrement audio</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            <div className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${isRecording ? 'bg-red-100 dark:bg-red-900/30' : 'bg-secondary'}`}>
              <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
            </div>
          </div>
          
          <div className="text-3xl font-mono mb-6">
            {formatTime(recordingTime)}
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onClick={toggleRecording}
              className="w-32"
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  Arrêter
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {hasRecording && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="recording-name">Nom de l'enregistrement</Label>
                <Input
                  id="recording-name"
                  value={recordingName}
                  onChange={(e) => setRecordingName(e.target.value)}
                  placeholder="Mon enregistrement audio"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={handleCancel}>
              <Trash className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Mes enregistrements</h3>
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun enregistrement pour le moment.</p>
            <p className="text-sm">Vos enregistrements audio apparaîtront ici.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioRecorderSection;
