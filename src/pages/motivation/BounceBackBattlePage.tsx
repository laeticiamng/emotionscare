import React, { useState } from 'react';
import UnifiedShell from '@/components/unified/UnifiedShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Zap, 
  Users, 
  Mic, 
  Heart, 
  Award, 
  Timer,
  MessageCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { useBounceBackBattle } from '@/hooks/useBounceBackBattle';

const BounceBackBattlePage: React.FC = () => {
  const {
    currentBattle,
    gameState,
    isRecording,
    startBattle,
    endBattle,
    startRecording,
    stopRecording,
    sendTip,
    isLoading
  } = useBounceBackBattle();

  const [pairToken, setPairToken] = useState('');
  const [tipMessage, setTipMessage] = useState('');

  const handleStartBattle = () => {
    startBattle('stress-boss');
  };

  const handleSendTip = () => {
    if (tipMessage.trim() && pairToken.trim()) {
      sendTip(pairToken, tipMessage);
      setTipMessage('');
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      <UnifiedShell>
        <div className="container mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Bounce-Back Battle</h1>
              <p className="text-muted-foreground">Combat coopératif contre le stress avec coaching IA</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Shield className="h-3 w-3 mr-1" />
              Mode Bataille
            </Badge>
          </div>

          {!currentBattle ? (
            /* Mode sélection de bataille */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartBattle}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Stress Boss Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Affrontez votre stress avec l'aide de l'IA et d'un partenaire
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">15 min</Badge>
                      <Badge variant="outline">Coaching vocal</Badge>
                      <Badge variant="outline">2 joueurs</Badge>
                    </div>
                    <Button className="w-full" disabled={isLoading}>
                      {isLoading ? 'Préparation...' : 'Commencer la bataille'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Burnout Recovery
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Programme intensif de récupération émotionnelle
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">30 min</Badge>
                      <Badge variant="outline">Solo/Duo</Badge>
                      <Badge variant="outline">Avancé</Badge>
                    </div>
                    <Button className="w-full" disabled>
                      Bientôt disponible
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Interface de bataille active */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Panneau principal de bataille */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Bataille en cours
                    </CardTitle>
                    <Badge variant={gameState?.status === 'active' ? 'default' : 'secondary'}>
                      {gameState?.status || 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Timer et progression */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Temps restant</span>
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span className="font-mono">
                          {gameState?.timeRemaining ? 
                            `${Math.floor(gameState.timeRemaining / 60)}:${(gameState.timeRemaining % 60).toString().padStart(2, '0')}` : 
                            '15:00'
                          }
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={gameState?.progress || 0} 
                      className="w-full h-2"
                    />
                  </div>

                  {/* Zone de défi principal */}
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {gameState?.currentChallenge || 'Respirez profondément et décrivez votre stress'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Utilisez le bouton d'enregistrement pour répondre au défi
                    </p>
                    
                    {/* Bouton d'enregistrement vocal */}
                    <Button
                      size="lg"
                      variant={isRecording ? 'destructive' : 'default'}
                      onClick={isRecording ? stopRecording : startRecording}
                      className="rounded-full w-20 h-20"
                    >
                      <Mic className={`h-8 w-8 ${isRecording ? 'animate-pulse' : ''}`} />
                    </Button>
                    
                    {isRecording && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Enregistrement en cours... Parlez librement
                      </p>
                    )}
                  </div>

                  {/* Stats de performance */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <Heart className="h-6 w-6 mx-auto mb-1 text-red-500" />
                      <div className="text-lg font-semibold">
                        {gameState?.stressLevel || 65}%
                      </div>
                      <div className="text-xs text-muted-foreground">Stress</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <TrendingUp className="h-6 w-6 mx-auto mb-1 text-green-500" />
                      <div className="text-lg font-semibold">
                        {gameState?.resilience || 40}%
                      </div>
                      <div className="text-xs text-muted-foreground">Résilience</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <Award className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                      <div className="text-lg font-semibold">
                        {gameState?.score || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  </div>

                  {/* Bouton de fin */}
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={endBattle}
                  >
                    Terminer la bataille
                  </Button>
                </CardContent>
              </Card>

              {/* Panneau de coaching coopératif */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Coaching Coopératif
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Connexion partenaire */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code partenaire</label>
                    <Input
                      value={pairToken}
                      onChange={(e) => setPairToken(e.target.value)}
                      placeholder="Entrez le code"
                      className="text-center font-mono"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Partagez ce code : <span className="font-mono bg-muted px-1 rounded">
                        {currentBattle?.id?.slice(-6) || 'ABC123'}
                      </span>
                    </p>
                  </div>

                  {/* Zone de tips */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Envoyer un conseil</label>
                    <Textarea
                      value={tipMessage}
                      onChange={(e) => setTipMessage(e.target.value)}
                      placeholder="Écrivez un message d'encouragement..."
                      rows={3}
                    />
                    <Button 
                      onClick={handleSendTip}
                      disabled={!tipMessage.trim() || !pairToken.trim()}
                      className="w-full"
                      size="sm"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Envoyer le conseil
                    </Button>
                  </div>

                  {/* Conseils reçus */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Conseils reçus</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {gameState?.receivedTips?.length ? (
                        gameState.receivedTips.map((tip, i) => (
                          <div key={i} className="p-2 bg-primary/5 border border-primary/20 rounded text-sm">
                            {tip}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Aucun conseil reçu pour le moment
                        </p>
                      )}
                    </div>
                  </div>

                  {/* IA Coach */}
                  <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">IA</span>
                      </div>
                      <span className="text-sm font-medium">Coach IA</span>
                    </div>
                    <p className="text-sm">
                      {gameState?.aiCoachMessage || 
                       'Excellent ! Votre respiration s\'améliore. Continuez à vous concentrer sur l\'instant présent.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Statistiques et historique */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de Récupération</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Batailles gagnées</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-muted-foreground">Partenaires aidés</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">+32%</div>
                  <div className="text-sm text-muted-foreground">Résilience gagnée</div>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">2,450</div>
                  <div className="text-sm text-muted-foreground">Points totaux</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </UnifiedShell>
    </div>
  );
};

export default BounceBackBattlePage;