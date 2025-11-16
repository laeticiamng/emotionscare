// @ts-nocheck
/**
 * ApiDocumentationPage - Documentation API complète
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { 
  Code, 
  Database, 
  Brain, 
  Music, 
  Scan, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface ApiDocumentationPageProps {
  'data-testid'?: string;
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/coach/message',
    description: 'Envoie un message au coach IA et reçoit une réponse personnalisée',
    icon: Brain,
    params: ['message', 'userId', 'sessionId'],
    response: 'Réponse du coach + suggestions'
  },
  {
    method: 'GET',
    path: '/api/emotions/analyze',
    description: 'Analyse les émotions d\'un texte ou audio',
    icon: Scan,
    params: ['input', 'type'],
    response: 'Données émotionnelles détaillées'
  },
  {
    method: 'POST',
    path: '/api/music/generate',
    description: 'Génère une musique thérapeutique personnalisée',
    icon: Music,
    params: ['mood', 'preferences', 'duration'],
    response: 'URL audio + métadonnées'
  },
  {
    method: 'GET',
    path: '/api/user/dashboard',
    description: 'Récupère les données du tableau de bord utilisateur',
    icon: Database,
    params: ['userId', 'period'],
    response: 'Métriques et analytics'
  }
];

export const ApiDocumentationPage: React.FC<ApiDocumentationPageProps> = ({ 'data-testid': testId }) => {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <main className="min-h-screen bg-background" data-testid={testId}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Documentation API</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intégrez EmotionsCare à vos applications avec notre API REST complète
          </p>
          <Badge className="mt-4">v2.0</Badge>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Démarrage Rapide
            </CardTitle>
            <CardDescription>
              Commencez à utiliser l'API EmotionsCare en quelques étapes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">1. Authentification</h3>
              <code className="text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">2. Base URL</h3>
              <code className="text-sm">
                https://api.emotionscare.com/v2
              </code>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">3. Content-Type</h3>
              <code className="text-sm">
                Content-Type: application/json
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Endpoints Disponibles</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <endpoint.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          <Badge 
                            variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                            className="mr-2"
                          >
                            {endpoint.method}
                          </Badge>
                          {endpoint.path}
                        </CardTitle>
                        <CardDescription>{endpoint.description}</CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(endpoint.path)}
                    >
                      {copiedEndpoint === endpoint.path ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Paramètres:</h4>
                      <div className="flex flex-wrap gap-1">
                        {endpoint.params.map((param) => (
                          <Badge key={param} variant="outline" className="text-xs">
                            {param}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Réponse:</h4>
                      <p className="text-sm text-muted-foreground">{endpoint.response}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Examples */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Exemples d'utilisation</CardTitle>
            <CardDescription>
              Exemples de requêtes pour commencer rapidement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Analyser une émotion (JavaScript)</h3>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`const response = await fetch('https://api.emotionscare.com/v2/emotions/analyze', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: "Je me sens un peu stressé aujourd'hui",
    type: "text"
  })
});

const emotionData = await response.json();
logger.debug(emotionData, 'COMPONENT');`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Envoyer un message au Coach (Python)</h3>
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`import requests

url = "https://api.emotionscare.com/v2/coach/message"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "message": "J'ai besoin de conseils pour gérer mon stress",
    "userId": "user123",
    "sessionId": "session456"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDKs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>SDKs Officiels</CardTitle>
            <CardDescription>
              Utilisez nos SDKs pour une intégration plus facile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-medium mb-2">JavaScript/Node.js</h3>
                <code className="text-sm text-muted-foreground">npm install @emotionscare/sdk</code>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Python</h3>
                <code className="text-sm text-muted-foreground">pip install emotionscare</code>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-medium mb-2">React</h3>
                <code className="text-sm text-muted-foreground">npm install @emotionscare/react</code>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe est là pour vous accompagner dans votre intégration
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>
              Contacter le Support
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Guide Complet
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};