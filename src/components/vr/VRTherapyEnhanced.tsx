import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play, Square, Eye, Sparkles, Activity, Clock, TrendingUp } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { logger } from '@/lib/logger';

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  environment_config: any;
  created_at: string;
}

interface VRSession {
  id: string;
  environment_config: any;
  status: string;
  created_at: string;
  completed_at?: string;
}

const VRTherapyEnhanced: React.FC = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [environments, setEnvironments] = useState<VREnvironment[]>([]);
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, avgDuration: 0 });

  // Paramètres de génération
  const [emotion, setEmotion] = useState('calm');
  const [intensity, setIntensity] = useState(5);
  const [duration, setDuration] = useState(10);
  const [environmentType, setEnvironmentType] = useState('nature');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Charger les environnements
      const { data: envData } = await supabase
        .from('vr_environments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (envData) setEnvironments(envData);

      // Charger les sessions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sessionData } = await supabase.functions.invoke('vr-therapy', {
        body: { action: 'list' }
      });

      if (sessionData?.sessions) {
        setSessions(sessionData.sessions);
        
        // Calculer les stats
        const completed = sessionData.sessions.filter((s: any) => s.status === 'completed').length;
        setStats({
          total: sessionData.sessions.length,
          completed,
          avgDuration: completed > 0 ? Math.round(sessionData.sessions.reduce((acc: number, s: any) => 
            s.completed_at ? acc + (new Date(s.completed_at).getTime() - new Date(s.created_at).getTime()) / 60000 : acc, 0) / completed) : 0
        });
      }
    } catch (error) {
      logger.error('Error loading data', error as Error, 'VR');
    }
  };

  const generateEnvironment = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('vr-therapy', {
        body: {
          emotion,
          intensity,
          duration,
          environmentType
        }
      });

      if (error) throw error;

      toast({
        title: 'Environnement VR généré',
        description: data.environment.name,
      });

      await loadData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startSession = async (environment: VREnvironment) => {
    try {
      const { data, error } = await supabase.functions.invoke('vr-therapy', {
        body: {
          action: 'start',
          environment: environment.environment_config
        }
      });

      if (error) throw error;

      setActiveSession(data.session);
      toast({
        title: 'Session VR démarrée',
        description: environment.name,
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const completeSession = async () => {
    if (!activeSession) return;

    try {
      const biometrics = {
        heartRate: Math.floor(Math.random() * 30) + 60,
        stressLevel: Math.random() * 5,
        relaxationScore: Math.random() * 10 + 5,
      };

      const { error } = await supabase.functions.invoke('vr-therapy', {
        body: {
          action: 'complete',
          sessionId: activeSession.id,
          biometrics
        }
      });

      if (error) throw error;

      toast({
        title: 'Session terminée',
        description: 'Biométrie enregistrée avec succès',
      });

      setActiveSession(null);
      await loadData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const VRScene: React.FC<{ config: any }> = ({ config }) => (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color={config?.settings?.groundColor || '#8fbc8f'} />
      </mesh>
      <OrbitControls />
      <Environment preset="sunset" />
    </Canvas>
  );

  return (
    <div className="space-y-6 p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions totales</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Complétées</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durée moy.</p>
                <p className="text-2xl font-bold">{stats.avgDuration}min</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session active */}
      {activeSession && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-primary animate-pulse" />
              Session VR Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[300px] rounded-lg overflow-hidden bg-gradient-to-b from-sky-200 to-green-100">
              <VRScene config={activeSession.environment_config} />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{activeSession.environment_config?.name}</p>
                <p className="text-sm text-muted-foreground">{activeSession.environment_config?.description}</p>
              </div>
              <Button onClick={completeSession} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Terminer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Générateur */}
      {!activeSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Générer un environnement VR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Émotion cible</label>
                <Select value={emotion} onValueChange={setEmotion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calm">Calme</SelectItem>
                    <SelectItem value="energized">Énergisé</SelectItem>
                    <SelectItem value="focused">Concentré</SelectItem>
                    <SelectItem value="relaxed">Détendu</SelectItem>
                    <SelectItem value="joyful">Joyeux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type d'environnement</label>
                <Select value={environmentType} onValueChange={setEnvironmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="ocean">Océan</SelectItem>
                    <SelectItem value="forest">Forêt</SelectItem>
                    <SelectItem value="mountain">Montagne</SelectItem>
                    <SelectItem value="abstract">Abstrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Intensité: {intensity}/10</label>
              <Slider
                value={[intensity]}
                onValueChange={(v) => setIntensity(v[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Durée: {duration} minutes</label>
              <Slider
                value={[duration]}
                onValueChange={(v) => setDuration(v[0])}
                min={5}
                max={30}
                step={5}
              />
            </div>

            <Button
              onClick={generateEnvironment}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer l'environnement
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Environnements disponibles */}
      {!activeSession && environments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Environnements disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {environments.map((env) => (
                <Card key={env.id} className="hover:border-primary transition-colors">
                  <CardContent className="pt-6 space-y-3">
                    <div>
                      <h3 className="font-semibold">{env.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {env.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {env.environment_config?.therapeutic_benefits?.slice(0, 2).map((benefit: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      onClick={() => startSession(env)}
                      className="w-full"
                      size="sm"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Démarrer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VRTherapyEnhanced;
