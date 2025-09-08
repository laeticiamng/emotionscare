/**
 * 📚 PAGE DOCUMENTATION API
 * Documentation technique pour les développeurs
 */

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code2, 
  Zap, 
  Shield, 
  Smartphone,
  Brain,
  Music,
  Activity,
  ExternalLink
} from 'lucide-react';

interface ApiDocumentationPageProps {
  'data-testid'?: string;
}

export default function ApiDocumentationPage({ 'data-testid': testId }: ApiDocumentationPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5" data-testid={testId}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Documentation API EmotionsCare
            </h1>
            <p className="text-muted-foreground text-lg">
              Intégrez l'analyse émotionnelle et la thérapie musicale dans vos applications
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge>REST API v2.0</Badge>
              <Badge variant="outline">WebSocket Support</Badge>
              <Badge variant="outline">Real-time</Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              <TabsTrigger value="emotion">Émotions</TabsTrigger>
              <TabsTrigger value="music">Musique</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Démarrage Rapide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <code className="text-sm">
                          curl -X POST https://api.emotionscare.com/v2/analyze<br/>
                          -H "Authorization: Bearer YOUR_TOKEN"<br/>
                          -H "Content-Type: application/json"<br/>
                          -d '{"text": "Je me sens bien aujourd'hui"}'
                        </code>
                      </div>
                      <Button className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Tester l'API
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Authentification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Utilisez des clés API pour authentifier vos requêtes.
                    </p>
                    <div className="bg-muted p-3 rounded">
                      <code className="text-sm">
                        Authorization: Bearer ems_live_key_...
                      </code>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Endpoints Principaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        {
                          endpoint: '/v2/analyze/text',
                          method: 'POST',
                          desc: 'Analyse émotionnelle de texte',
                          icon: Brain
                        },
                        {
                          endpoint: '/v2/music/generate',
                          method: 'POST',
                          desc: 'Génération musicale adaptative',
                          icon: Music
                        },
                        {
                          endpoint: '/v2/wellness/recommendations',
                          method: 'GET',
                          desc: 'Recommandations bien-être',
                          icon: Activity
                        }
                      ].map((api, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <api.icon className="w-4 h-4 text-primary" />
                            <Badge variant="outline">{api.method}</Badge>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{api.endpoint}</h4>
                          <p className="text-xs text-muted-foreground">{api.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="emotion" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Analyse Émotionnelle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Analysez les émotions dans le texte avec notre IA avancée basée sur Hume et OpenAI.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Requête POST /v2/analyze/text</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm whitespace-pre">{JSON.stringify({
                            text: "Je me sens vraiment bien aujourd'hui, plein d'énergie !",
                            options: {
                              detailed: true,
                              confidence_threshold: 0.7
                            }
                          }, null, 2)}</code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Réponse</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm whitespace-pre">{JSON.stringify({
                            emotion: "happy",
                            confidence: 0.89,
                            emotions_breakdown: {
                              joy: 0.89,
                              energy: 0.76,
                              excitement: 0.65
                            },
                            recommendations: [
                              "Musique énergique et positive",
                              "Activités physiques dynamiques"
                            ]
                          }, null, 2)}</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="music" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="w-5 h-5" />
                      Génération Musicale
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Générez de la musique thérapeutique personnalisée avec notre intégration Suno.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Requête POST /v2/music/generate</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm whitespace-pre">{JSON.stringify({
                            emotion: "calm",
                            intensity: 0.7,
                            preferences: {
                              genre: "ambient",
                              duration: 180,
                              instrumental: true
                            }
                          }, null, 2)}</code>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Réponse</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <code className="text-sm whitespace-pre">{JSON.stringify({
                            track_id: "ems_track_abc123",
                            audio_url: "https://cdn.emotionscare.com/tracks/abc123.mp3",
                            title: "Sérénité Matinale",
                            duration: 180,
                            generated_at: "2024-01-15T10:30:00Z",
                            status: "ready"
                          }, null, 2)}</code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="auth" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Authentification & Sécurité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Clés API</h4>
                        <p className="text-muted-foreground mb-2">
                          Obtenez vos clés API depuis votre dashboard développeur.
                        </p>
                        <div className="bg-muted p-3 rounded">
                          <code>ems_live_key_1234567890abcdef</code> (Production)<br/>
                          <code>ems_test_key_abcdef1234567890</code> (Test)
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Rate Limiting</h4>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• 1000 requêtes/heure (Plan Gratuit)</li>
                          <li>• 10,000 requêtes/heure (Plan Pro)</li>
                          <li>• Illimité (Plan Enterprise)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Codes d'Erreur</h4>
                        <div className="space-y-2">
                          {[
                            { code: '401', desc: 'Clé API invalide' },
                            { code: '429', desc: 'Limite de taux dépassée' },
                            { code: '422', desc: 'Paramètres de requête invalides' }
                          ].map((error, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                              <Badge variant="outline">{error.code}</Badge>
                              <span className="text-sm">{error.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Support */}
          <div className="mt-12 text-center p-6 bg-primary/5 rounded-lg">
            <Smartphone className="w-8 h-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Besoin d'Aide ?</h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe technique est disponible pour vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button>
                <Code2 className="w-4 h-4 mr-2" />
                Support Technique
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Exemples de Code
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}