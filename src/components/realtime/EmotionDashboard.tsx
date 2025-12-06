import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEmotionFusion } from '@/hooks/useEmotionFusion';
import { Play, Square, Camera, Mic, MessageSquare } from 'lucide-react';
import { Input } from '@/components/ui/input';

const EmotionDashboard: React.FC = () => {
  const { emotionState, vision, voice, text, startAll, stopAll } = useEmotionFusion();
  const [textInput, setTextInput] = React.useState('');

  const handleTextSubmit = async () => {
    if (textInput.trim()) {
      await text.analyze(textInput);
      setTextInput('');
    }
  };

  const getMoodColor = (moodIndex: number) => {
    if (moodIndex >= 70) return 'text-green-500';
    if (moodIndex >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 300) return 'text-green-500';
    if (latency < 800) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* En-tête avec contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>🎭 Analyse Émotionnelle Temps Réel</span>
            <Button 
              onClick={emotionState.isActive ? stopAll : startAll}
              variant={emotionState.isActive ? "destructive" : "default"}
            >
              {emotionState.isActive ? (
                <><Square className="mr-2 h-4 w-4" /> Arrêter</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Démarrer</>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Indice d'humeur global */}
      {emotionState.fused && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Indice d'Humeur Global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getMoodColor(emotionState.fused.mood_index)}`}>
                {emotionState.fused.mood_index}
              </div>
              <div className="text-2xl capitalize">{emotionState.fused.label}</div>
              <div className="flex gap-2 justify-center">
                <Badge variant="outline">
                  <Camera className="mr-1 h-3 w-3" />
                  Vision: {Math.round(emotionState.fused.confidences.vision * 100)}%
                </Badge>
                <Badge variant="outline">
                  <Mic className="mr-1 h-3 w-3" />
                  Voix: {Math.round(emotionState.fused.confidences.voice * 100)}%
                </Badge>
                <Badge variant="outline">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Texte: {Math.round(emotionState.fused.confidences.text * 100)}%
                </Badge>
              </div>
              <div className={`text-sm ${getLatencyColor(emotionState.fused.latency_ms)}`}>
                Latence: {emotionState.fused.latency_ms}ms
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Vision */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Vision
              {vision.isActive && <Badge variant="success">Live</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {vision.lastResult ? (
              <>
                <div className="text-2xl font-bold capitalize">{vision.lastResult.label}</div>
                <div className="text-sm text-muted-foreground">
                  Confiance: {Math.round(vision.lastResult.confidence * 100)}%
                </div>
                <div className={`text-xs ${getLatencyColor(vision.latency)}`}>
                  {vision.latency}ms
                </div>
                <div className="space-y-1 text-xs">
                  {Object.entries(vision.lastResult.scores)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([emotion, score]) => (
                      <div key={emotion} className="flex justify-between">
                        <span className="capitalize">{emotion}</span>
                        <span>{Math.round(score * 100)}%</span>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {vision.isActive ? 'Analyse en cours...' : 'Démarrez l\'analyse'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Voix
              {voice.isActive && <Badge variant="success">Live</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {voice.lastResult ? (
              <>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Valence</div>
                    <div className="text-lg font-semibold">
                      {Math.round(voice.lastResult.prosody.valence * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Arousal</div>
                    <div className="text-lg font-semibold">
                      {Math.round(voice.lastResult.prosody.arousal * 100)}%
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Confiance: {Math.round(voice.lastResult.confidence * 100)}%
                </div>
                <div className={`text-xs ${getLatencyColor(voice.latency)}`}>
                  {voice.latency}ms
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                {voice.isActive ? 'Écoute en cours...' : 'Démarrez l\'analyse'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Texte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Texte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <Input
                placeholder="Comment vous sentez-vous ?"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              />
              <Button 
                onClick={handleTextSubmit} 
                disabled={!textInput.trim() || text.isAnalyzing}
                className="w-full"
                size="sm"
              >
                Analyser
              </Button>
            </div>
            {text.lastResult && (
              <>
                <div className="text-2xl font-bold capitalize">{text.lastResult.label}</div>
                <div className="text-sm text-muted-foreground">
                  Sentiment: {text.lastResult.sentiment > 0 ? '+' : ''}
                  {Math.round(text.lastResult.sentiment * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Confiance: {Math.round(text.lastResult.confidence * 100)}%
                </div>
                <div className={`text-xs ${getLatencyColor(text.latency)}`}>
                  {text.latency}ms
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latences globales */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Temps Réel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-xs text-muted-foreground">Vision</div>
              <div className={`text-lg font-semibold ${getLatencyColor(emotionState.latency.vision)}`}>
                {emotionState.latency.vision}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Voix</div>
              <div className={`text-lg font-semibold ${getLatencyColor(emotionState.latency.voice)}`}>
                {emotionState.latency.voice}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Texte</div>
              <div className={`text-lg font-semibold ${getLatencyColor(emotionState.latency.text)}`}>
                {emotionState.latency.text}ms
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fusion</div>
              <div className={`text-lg font-semibold ${getLatencyColor(emotionState.latency.fusion)}`}>
                {emotionState.latency.fusion}ms
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionDashboard;
