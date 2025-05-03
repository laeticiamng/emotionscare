
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockEmotions, mockUsers } from '@/data/mockData';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Brain, Mic, MonitorPlay } from 'lucide-react';

const ScanDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [emojis, setEmojis] = useState('😊');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  // Find user
  const user = mockUsers.find(u => u.id === userId);
  
  // Previous emotions for this user
  const userEmotions = mockEmotions.filter(e => e.user_id === userId);
  const latestEmotion = userEmotions.length > 0 ? userEmotions[0] : null;
  
  // Common emoji sets
  const emojiSets = [
    '😊 😌 🙂 😃 😄',
    '😐 😑 😶 🙄 😒',
    '😔 😓 😢 😞 😥',
    '😠 😡 😤 😠 🤬',
    '😰 😨 😱 😳 😬',
  ];
  
  // Toggle recording (mock)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      toast({
        title: "Enregistrement démarré",
        description: "Parlez de votre journée...",
      });
    } else {
      toast({
        title: "Enregistrement terminé",
        description: "Audio capturé avec succès.",
      });
    }
  };
  
  // Handle analysis
  const handleAnalyze = () => {
    if (!text && !emojis) {
      toast({
        title: "Entrée requise",
        description: "Veuillez saisir du texte ou des émojis avant d'analyser.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      // Mock AI result
      if (emojis.includes('😊') || text.toLowerCase().includes('bien')) {
        setAiResult("Votre état émotionnel semble positif. Je détecte des signes de bien-être et d'optimisme. Continuez à maintenir cette attitude positive et envisagez une courte session de méditation pour renforcer cet état.");
      } else if (emojis.includes('😔') || text.toLowerCase().includes('fatigué') || text.toLowerCase().includes('stress')) {
        setAiResult("Je détecte des signes de fatigue et de stress dans votre expression. Je vous suggère une micro-pause VR de 5 minutes pour vous ressourcer et une séance de respiration guidée.");
      } else {
        setAiResult("Votre état émotionnel semble neutre avec quelques variations. Une courte pause VR pourrait vous aider à maintenir votre équilibre émotionnel.");
      }
      
      setIsAnalyzing(false);
      
      toast({
        title: "Analyse terminée",
        description: "Résultats disponibles",
      });
    }, 2000);
  };
  
  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }
  
  return (
    <div className="cocoon-page">
      <Button variant="ghost" onClick={() => navigate('/scan')} className="mb-6">
        <ArrowLeft size={16} className="mr-2" /> Retour à la liste
      </Button>
      
      <div className="flex items-center mb-8">
        <Avatar className="h-16 w-16 mr-4 border-2 border-muted">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{user.role}</span>
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
              {user.anonymity_code}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                Nouveau scan émotionnel
              </CardTitle>
              <CardDescription>
                Comment vous sentez-vous aujourd'hui?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="cocoon-label">Émojis d'humeur</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex overflow-x-auto pb-2 gap-2 cocoon-input">
                    <input
                      type="text"
                      value={emojis}
                      onChange={(e) => setEmojis(e.target.value)}
                      className="flex-1 outline-none bg-transparent"
                      placeholder="Exprimez votre humeur avec des emojis..."
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {emojiSets.map((set, idx) => (
                      <Button 
                        key={idx}
                        type="button" 
                        variant="outline"
                        size="sm"
                        onClick={() => setEmojis(set)}
                        className="text-lg"
                      >
                        {set}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="cocoon-label">Comment ça va?</label>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Exprimez votre état émotionnel en quelques mots..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="cocoon-label">Audio (optionnel)</label>
                <Button 
                  onClick={toggleRecording} 
                  variant={isRecording ? "destructive" : "outline"}
                  className="w-full justify-center"
                >
                  <Mic size={16} className={`mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer un message vocal'}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!text && !emojis)}
                className="w-full"
              >
                <Brain size={16} className="mr-2" />
                {isAnalyzing ? 'Analyse en cours...' : 'Analyser'}
              </Button>
            </CardFooter>
          </Card>
          
          {aiResult && (
            <Card className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Brain size={18} className="mr-2 text-primary" />
                  Résultat de l'analyse IA
                </CardTitle>
                <CardDescription>
                  Basé sur votre expression actuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{aiResult}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate('/vr')}
                  variant="outline"
                  className="w-full"
                >
                  <MonitorPlay size={16} className="mr-2" />
                  Planifier micro-pause VR
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {latestEmotion && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Scan précédent</CardTitle>
                <CardDescription>
                  {new Date(latestEmotion.date).toLocaleDateString('fr-FR')} - Score: {latestEmotion.score}/100
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestEmotion.emojis && (
                  <div>
                    <span className="text-sm text-muted-foreground">Émojis:</span>
                    <div className="text-2xl">{latestEmotion.emojis}</div>
                  </div>
                )}
                
                {latestEmotion.text && (
                  <div>
                    <span className="text-sm text-muted-foreground">Expression:</span>
                    <p className="text-sm mt-1 p-3 bg-muted rounded-md">{latestEmotion.text}</p>
                  </div>
                )}
                
                {latestEmotion.ai_feedback && (
                  <div>
                    <span className="text-sm text-muted-foreground">Feedback IA:</span>
                    <p className="text-sm mt-1 p-3 bg-secondary rounded-md">{latestEmotion.ai_feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Évolution émotionnelle</CardTitle>
              <CardDescription>
                Les 7 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Graphique d'évolution émotionnelle à venir...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScanDetailPage;
