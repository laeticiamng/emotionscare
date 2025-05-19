
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, ScanText, Music, ScanBarcode, Image } from 'lucide-react';
import EmotionScanner from '@/components/scan/EmotionScanner';
import { ScanResult, EmotionResult } from '@/types';
import { useEmotionScan } from '@/hooks/useEmotionScan';
import { useMusic } from '@/hooks/useMusic';

const B2CScan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('emotion');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { setOpenDrawer } = useMusic();
  const { createEmotion } = useEmotionScan();

  const handleScanStart = async (type: 'object' | 'text' | 'emotion') => {
    setScanning(true);
    
    // Simulate scanning process with a timer
    setTimeout(() => {
      // Mock scan results
      const newScanResult: ScanResult = {
        id: Math.random().toString(36).substring(2, 11),
        type,
        content: type === 'object' 
          ? 'Une tasse à café bleue' 
          : type === 'text' 
            ? 'Notes manuscrites sur un cahier' 
            : 'Analyse émotionnelle',
        detected_emotions: ['calme', 'nostalgie'],
        score: 0.85,
        created_at: new Date().toISOString(),
        recommendations: [
          'Cette tasse évoque des sentiments de calme et de routine.',
          'Considérez d\'associer cet objet à un moment de pleine conscience.'
        ],
        tags: ['objet quotidien', 'rituel', 'confort']
      };
      
      setScanResults(prev => [newScanResult, ...prev]);
      setScanning(false);
      
      toast({
        title: 'Scan complété',
        description: `${type === 'object' ? 'Objet' : type === 'text' ? 'Texte' : 'Émotion'} analysé avec succès.`,
      });
    }, 2000);
  };

  const handleEmotionScanResult = async (result: EmotionResult) => {
    try {
      await createEmotion({
        emotion: result.emotion,
        score: result.score,
        confidence: result.confidence,
        text: result.text,
        date: new Date().toISOString(),
        emojis: result.emojis
      });
      
      toast({
        title: 'Émotion détectée',
        description: `${result.emotion} (${Math.round(result.score * 100)}% confiance)`,
      });
      
      // Suggest a music based on the emotion
      setOpenDrawer(true);
      
    } catch (error) {
      console.error('Error saving emotion scan:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold mb-2">Scan Émotionnel</h1>
        <p className="text-muted-foreground">
          Analysez vos émotions, objets personnels et textes pour des recommandations personnalisées.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="emotion" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Émotion</span>
          </TabsTrigger>
          <TabsTrigger value="object" className="flex items-center gap-2">
            <ScanBarcode className="h-4 w-4" />
            <span>Objet</span>
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <ScanText className="h-4 w-4" />
            <span>Texte</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emotion" className="space-y-4">
          <EmotionScanner onResult={handleEmotionScanResult} />
        </TabsContent>

        <TabsContent value="object" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan d'objet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                {scanning ? (
                  <>
                    <video ref={videoRef} className="absolute inset-0 object-cover w-full h-full" autoPlay muted />
                    <motion.div
                      className="absolute inset-0 border-4 border-primary z-10"
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <p className="text-primary font-medium z-20 bg-background/80 px-3 py-1 rounded-md">
                      Analyse en cours...
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <ScanBarcode className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Cliquez sur "Scanner" pour analyser un objet</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => handleScanStart('object')}
                  disabled={scanning}
                  className="w-full sm:w-auto"
                >
                  {scanning ? 'Analyse en cours...' : 'Scanner un objet'}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Cadrez l'objet dans la fenêtre et maintenez-le immobile pendant l'analyse.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan de texte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border flex items-center justify-center">
                {scanning ? (
                  <>
                    <video ref={videoRef} className="absolute inset-0 object-cover w-full h-full" autoPlay muted />
                    <motion.div
                      className="absolute inset-0 border-4 border-primary z-10"
                      initial={{ opacity: 0.5, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <p className="text-primary font-medium z-20 bg-background/80 px-3 py-1 rounded-md">
                      Lecture du texte...
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <ScanText className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Cliquez sur "Scanner" pour analyser un texte manuscrit</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => handleScanStart('text')}
                  disabled={scanning}
                  className="w-full sm:w-auto"
                >
                  {scanning ? 'Lecture en cours...' : 'Scanner un texte'}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Cadrez le texte manuscrit dans la fenêtre pour une analyse émotionnelle et une transcription.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {scanResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Résultats récents</h2>
          <div className="space-y-4">
            {scanResults.slice(0, 3).map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {result.type === 'object' 
                        ? 'Scan d\'objet' 
                        : result.type === 'text' 
                          ? 'Scan de texte' 
                          : 'Scan émotionnel'}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {new Date(result.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-medium mb-2">{result.content}</p>
                  
                  {result.detected_emotions && (
                    <div className="flex gap-2 mb-3">
                      {result.detected_emotions.map((emotion) => (
                        <span 
                          key={emotion} 
                          className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {result.recommendations && (
                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-medium">Recommandations :</h4>
                      <ul className="text-sm space-y-1">
                        {result.recommendations.map((recommendation, i) => (
                          <li key={i} className="text-muted-foreground">• {recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Image size={14} /> Visualiser
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Music size={14} /> Recommander musique
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default B2CScan;
