
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronLeft, Download, Share2, CalendarIcon, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';

// Mock session data
const mockSessionData = {
  '1': {
    id: '1',
    date: '2025-05-15',
    startTime: '14:30',
    endTime: '14:45',
    duration: 15,
    environment: 'Forêt',
    emotionBefore: 'Anxieux',
    emotionAfter: 'Calme',
    anxietyReduction: 35,
    heartRateBefore: 88,
    heartRateAfter: 72,
    notes: 'La séance en forêt était très apaisante, j\'ai ressenti une forte connexion avec la nature et une réduction significative de mon anxiété.',
    timelineData: [
      { minute: 0, anxiety: 80, heartRate: 88 },
      { minute: 3, anxiety: 75, heartRate: 85 },
      { minute: 6, anxiety: 65, heartRate: 80 },
      { minute: 9, anxiety: 60, heartRate: 78 },
      { minute: 12, anxiety: 55, heartRate: 74 },
      { minute: 15, anxiety: 45, heartRate: 72 },
    ],
    recommendations: [
      'Continuer les sessions en forêt pour maintenir les effets positifs',
      'Essayer des exercices de respiration avant la prochaine session',
      'Augmenter progressivement la durée des sessions jusqu\'à 20 minutes'
    ]
  },
  '2': {
    id: '2',
    date: '2025-05-12',
    startTime: '10:15',
    endTime: '10:35',
    duration: 20,
    environment: 'Plage',
    emotionBefore: 'Stressé',
    emotionAfter: 'Détendu',
    anxietyReduction: 42,
    heartRateBefore: 90,
    heartRateAfter: 68,
    notes: 'L\'environnement de plage était extrêmement relaxant. Le bruit des vagues a eu un effet calmant immédiat.',
    timelineData: [
      { minute: 0, anxiety: 85, heartRate: 90 },
      { minute: 5, anxiety: 70, heartRate: 82 },
      { minute: 10, anxiety: 60, heartRate: 76 },
      { minute: 15, anxiety: 50, heartRate: 72 },
      { minute: 20, anxiety: 43, heartRate: 68 },
    ],
    recommendations: [
      'Associer la musique de vagues à vos moments de stress quotidien',
      'Programmer des sessions régulières avec l\'environnement plage',
      'Explorer la méditation guidée pendant les sessions'
    ]
  },
  '3': {
    id: '3',
    date: '2025-05-08',
    startTime: '16:45',
    endTime: '16:55',
    duration: 10,
    environment: 'Montagne',
    emotionBefore: 'Nerveux',
    emotionAfter: 'Serein',
    anxietyReduction: 28,
    heartRateBefore: 86,
    heartRateAfter: 76,
    notes: 'Session courte mais efficace. L\'environnement montagneux offre une sensation de perspective et d\'espace.',
    timelineData: [
      { minute: 0, anxiety: 75, heartRate: 86 },
      { minute: 3, anxiety: 68, heartRate: 82 },
      { minute: 6, anxiety: 60, heartRate: 80 },
      { minute: 10, anxiety: 47, heartRate: 76 },
    ],
    recommendations: [
      'Augmenter la durée des sessions pour un effet plus durable',
      'Essayer des exercices de respiration profonde pendant la session',
      'Combiner avec une séance de méditation après la VR'
    ]
  },
  '4': {
    id: '4',
    date: '2025-05-02',
    startTime: '09:30',
    endTime: '09:55',
    duration: 25,
    environment: 'Forêt',
    emotionBefore: 'Inquiet',
    emotionAfter: 'Apaisé',
    anxietyReduction: 45,
    heartRateBefore: 92,
    heartRateAfter: 70,
    notes: 'Excellente session longue. Les effets semblent plus durables avec une session prolongée.',
    timelineData: [
      { minute: 0, anxiety: 85, heartRate: 92 },
      { minute: 5, anxiety: 80, heartRate: 88 },
      { minute: 10, anxiety: 65, heartRate: 82 },
      { minute: 15, anxiety: 55, heartRate: 76 },
      { minute: 20, anxiety: 48, heartRate: 72 },
      { minute: 25, anxiety: 40, heartRate: 70 },
    ],
    recommendations: [
      'Maintenir cette durée de session pour un effet optimal',
      'Intégrer des techniques de pleine conscience pendant la session',
      'Programmer des sessions matinales pour un effet bénéfique sur la journée'
    ]
  },
  '5': {
    id: '5',
    date: '2025-04-28',
    startTime: '17:15',
    endTime: '17:30',
    duration: 15,
    environment: 'Plage',
    emotionBefore: 'Tendu',
    emotionAfter: 'Relaxé',
    anxietyReduction: 32,
    heartRateBefore: 84,
    heartRateAfter: 74,
    notes: 'Session de fin de journée qui a permis de décompresser efficacement après une journée stressante.',
    timelineData: [
      { minute: 0, anxiety: 78, heartRate: 84 },
      { minute: 5, anxiety: 70, heartRate: 80 },
      { minute: 10, anxiety: 58, heartRate: 76 },
      { minute: 15, anxiety: 46, heartRate: 74 },
    ],
    recommendations: [
      'Intégrer cette routine en fin de journée',
      'Ajouter des exercices de respiration avant la session',
      'Essayer différents environnements pour comparer les effets'
    ]
  }
};

const VRSessionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect if session not found or id is undefined
  if (!id || !mockSessionData[id as keyof typeof mockSessionData]) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Session non trouvée</h1>
          <p>La session que vous cherchez n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/vr-analytics')}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux statistiques
          </Button>
        </div>
      </div>
    );
  }
  
  const session = mockSessionData[id as keyof typeof mockSessionData];
  
  const handleDownload = () => {
    toast.success('Rapport téléchargé avec succès');
  };
  
  const handleShare = () => {
    toast.success('Lien de partage copié dans le presse-papiers');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/vr-analytics')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Session VR #{id}</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Télécharger le rapport
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Date</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-medium">{new Date(session.date).toLocaleDateString('fr-FR')}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Durée</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-medium">{session.duration} minutes</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">Réduction d'anxiété</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-medium">{session.anxietyReduction}%</span>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="metrics">Métriques</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé de la session</CardTitle>
              <CardDescription>
                Session VR en environnement {session.environment} du {new Date(session.date).toLocaleDateString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Détails de la session</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Environnement:</dt>
                      <dd>{session.environment}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Heure de début:</dt>
                      <dd>{session.startTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Heure de fin:</dt>
                      <dd>{session.endTime}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Durée:</dt>
                      <dd>{session.duration} minutes</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Effets sur l'état émotionnel</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-muted-foreground mb-1">État avant la session:</dt>
                      <dd className="font-medium">{session.emotionBefore}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-1">État après la session:</dt>
                      <dd className="font-medium text-green-600 dark:text-green-400">{session.emotionAfter}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground mb-1">Amélioration:</dt>
                      <dd>
                        <Progress value={session.anxietyReduction} className="h-2" />
                        <span className="text-sm font-medium mt-1 block">{session.anxietyReduction}% de réduction d'anxiété</span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métriques physiologiques</CardTitle>
              <CardDescription>
                Évolution de votre anxiété et rythme cardiaque pendant la session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={session.timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="minute" label={{ value: 'Minutes', position: 'insideBottomRight', offset: -5 }} />
                      <YAxis yAxisId="left" label={{ value: 'Anxiété (%)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'BPM', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="anxiety" name="Niveau d'anxiété" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="heartRate" name="Rythme cardiaque" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Rythme cardiaque</h3>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avant:</span>
                      <span className="font-medium">{session.heartRateBefore} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Après:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{session.heartRateAfter} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réduction:</span>
                      <span className="font-medium">{Math.round(((session.heartRateBefore - session.heartRateAfter) / session.heartRateBefore) * 100)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Niveau d'anxiété</h3>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avant:</span>
                      <span className="font-medium">{session.timelineData[0].anxiety}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Après:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{session.timelineData[session.timelineData.length - 1].anxiety}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Réduction:</span>
                      <span className="font-medium">{session.anxietyReduction}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notes de session</CardTitle>
              <CardDescription>
                Vos observations personnelles de la session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-md">
                <p className="whitespace-pre-wrap">{session.notes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
              <CardDescription>
                Basées sur votre expérience et progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {session.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3">
                      {index + 1}
                    </div>
                    <p>{recommendation}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/sessions')}>
                Planifier votre prochaine session
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VRSessionPage;
