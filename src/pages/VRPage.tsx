import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Play, Pause, RotateCcw, Timer, Zap, Waves, Mountain } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface VRTemplate {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: string;
  difficulty: string;
  thumbnailUrl: string;
}

const mockTemplates: VRTemplate[] = [
  {
    id: '1',
    title: 'Calm Beach',
    description: 'Relax on a serene beach with gentle waves and soothing sounds.',
    duration: 10,
    category: 'Relaxation',
    difficulty: 'Beginner',
    thumbnailUrl: '/images/vr/beach.jpg',
  },
  {
    id: '2',
    title: 'Mountain Meditation',
    description: 'Find peace in the mountains with guided meditation.',
    duration: 15,
    category: 'Meditation',
    difficulty: 'Intermediate',
    thumbnailUrl: '/images/vr/mountain.jpg',
  },
  {
    id: '3',
    title: 'Forest Walk',
    description: 'Take a calming walk through a lush forest environment.',
    duration: 20,
    category: 'Mindfulness',
    difficulty: 'Advanced',
    thumbnailUrl: '/images/vr/forest.jpg',
  },
];

const VRPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<VRTemplate | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [activeTab, setActiveTab] = useState('templates');

  useEffect(() => {
    let interval: number | undefined;
    if (isPlaying && selectedTemplate) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            clearInterval(interval);
            toast.success('Session terminée !');
            return 100;
          }
          return prev + 1;
        });
      }, (selectedTemplate.duration * 60 * 1000) / 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, selectedTemplate]);

  const handleStart = () => {
    if (!selectedTemplate) {
      toast.error('Veuillez sélectionner une session VR.');
      return;
    }
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Settings className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Expériences VR Immersives
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plongez dans des environnements virtuels conçus pour améliorer votre bien-être émotionnel
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Sessions VR</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
          </TabsList>

          <TabsContent value="templates">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer border-2 ${
                    selectedTemplate?.id === template.id ? 'border-purple-600' : 'border-transparent'
                  } hover:border-purple-400 transition`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="rounded-t-md w-full h-40 object-cover"
                  />
                  <CardContent>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                    <div className="flex justify-between mt-2">
                      <Badge variant="secondary">{template.category}</Badge>
                      <Badge variant="outline">{template.difficulty}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Durée: {template.duration} min
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardContent>
                <CardTitle>À propos des expériences VR</CardTitle>
                <CardDescription>
                  Nos sessions VR immersives sont conçues pour vous aider à vous détendre, méditer, et améliorer votre bien-être émotionnel grâce à des environnements virtuels apaisants.
                </CardDescription>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Player Controls */}
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-xl mx-auto bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-2xl font-semibold mb-2">{selectedTemplate.title}</h2>
            <p className="text-muted-foreground mb-4">{selectedTemplate.description}</p>

            <Progress value={progress} className="mb-4" />

            <div className="flex items-center justify-center gap-4">
              {!isPlaying ? (
                <Button onClick={handleStart} variant="primary" size="lg" aria-label="Démarrer la session">
                  <Play className="mr-2 h-5 w-5" />
                  Démarrer
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline" size="lg" aria-label="Mettre en pause la session">
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} variant="ghost" size="lg" aria-label="Réinitialiser la session">
                <RotateCcw className="mr-2 h-5 w-5" />
                Réinitialiser
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VRPage;
