import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code, 
  Key, 
  Globe, 
  Zap, 
  Shield, 
  BookOpen,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: 'sandbox' | 'production';
  permissions: string[];
  lastUsed?: string;
  requests: number;
  created: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  lastDelivery?: string;
}

const apiKeys: APIKey[] = [
  {
    id: '1',
    name: 'Development Key',
    key: 'ek_test_4242424242424242',
    environment: 'sandbox',
    permissions: ['read:emotions', 'write:sessions'],
    lastUsed: '2024-01-20T10:30:00Z',
    requests: 1247,
    created: '2024-01-01T00:00:00Z'
  }
];

const webhookEndpoints: WebhookEndpoint[] = [
  {
    id: '1',
    url: 'https://myapp.com/webhooks/emotions',
    events: ['session.completed', 'emotion.analyzed'],
    secret: 'whsec_1234567890abcdef',
    active: true,
    lastDelivery: '2024-01-20T15:45:00Z'
  }
];

const availableEndpoints = [
  {
    method: 'GET',
    path: '/v1/emotions/analyze',
    description: 'Analyser les émotions d\'un texte',
    auth: true
  },
  {
    method: 'POST',
    path: '/v1/sessions',
    description: 'Créer une nouvelle session',
    auth: true
  },
  {
    method: 'GET',
    path: '/v1/sessions/{id}',
    description: 'Récupérer les détails d\'une session',
    auth: true
  },
  {
    method: 'GET',
    path: '/v1/users/{id}/insights',
    description: 'Obtenir les insights utilisateur',
    auth: true
  },
  {
    method: 'POST',
    path: '/v1/webhooks',
    description: 'Créer un endpoint webhook',
    auth: true
  }
];

export default function PublicAPIPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [newApiKeyName, setNewApiKeyName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});

  const generateApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast.error('Veuillez saisir un nom pour la clé API');
      return;
    }
    
    toast.success(`Clé API "${newApiKeyName}" créée avec succès`);
    setNewApiKeyName('');
  };

  const createWebhook = () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Veuillez saisir une URL valide');
      return;
    }
    
    toast.success('Endpoint webhook créé avec succès');
    setNewWebhookUrl('');
    setSelectedEvents([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const formatKey = (key: string, show: boolean) => {
    if (show) return key;
    return key.substring(0, 8) + '••••••••••••••••••••';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              API Publique EmotionsCare
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Intégrez l'intelligence émotionnelle dans vos applications avec notre API REST sécurisée.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full lg:w-max grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="keys">Clés API</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="usage">Utilisation</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Haute Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    API optimisée avec latence &lt; 100ms et disponibilité 99.9%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Ultra Sécurisée</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Authentification OAuth 2.0, chiffrement TLS 1.3, conformité RGPD
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Documentation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Guide complet, exemples de code, SDK pour tous langages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Endpoints disponibles */}
            <Card>
              <CardHeader>
                <CardTitle>Endpoints Disponibles</CardTitle>
                <CardDescription>
                  Principales fonctionnalités accessibles via notre API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableEndpoints.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono">{endpoint.path}</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                        {endpoint.auth && <Shield className="h-4 w-4 text-amber-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des clés API */}
          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer une nouvelle clé API</CardTitle>
                <CardDescription>
                  Générez une clé pour authentifier vos requêtes API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="keyName">Nom de la clé</Label>
                    <Input
                      id="keyName"
                      placeholder="Ex: Production App"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={generateApiKey} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Générer la clé
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clés API Existantes</CardTitle>
                <CardDescription>
                  Gérez vos clés d'authentification API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={apiKey.environment === 'production' ? 'default' : 'secondary'}>
                              {apiKey.environment}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {apiKey.requests.toLocaleString()} requêtes
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {/* delete logic */}}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono flex-1">
                          {formatKey(apiKey.key, showKeys[apiKey.id])}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <div>Permissions: {apiKey.permissions.join(', ')}</div>
                        <div>Dernière utilisation: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleString() : 'Jamais'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer un webhook</CardTitle>
                <CardDescription>
                  Recevez des notifications en temps réel sur les événements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">URL du webhook</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://votre-app.com/webhooks/emotions"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Événements à écouter</Label>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    {[
                      'session.completed',
                      'emotion.analyzed', 
                      'user.signup',
                      'subscription.changed',
                      'report.generated'
                    ].map((event) => (
                      <label key={event} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedEvents.includes(event)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEvents([...selectedEvents, event]);
                            } else {
                              setSelectedEvents(selectedEvents.filter(e => e !== event));
                            }
                          }}
                        />
                        <span>{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button onClick={createWebhook}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer le webhook
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks Configurés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhookEndpoints.map((webhook) => (
                    <div key={webhook.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm">{webhook.url}</code>
                            <Badge variant={webhook.active ? 'default' : 'secondary'}>
                              {webhook.active ? 'Actif' : 'Inactif'}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Événements: {webhook.events.join(', ')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Dernière livraison: {webhook.lastDelivery ? new Date(webhook.lastDelivery).toLocaleString() : 'Aucune'}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Démarrage Rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Authentification</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.emotionscare.com/v1/emotions/analyze`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">2. Analyser des émotions</h4>
                  <pre className="bg-muted p-3 rounded text-sm">
{`POST /v1/emotions/analyze
{
  "text": "Je me sens vraiment bien aujourd'hui !",
  "language": "fr"
}

Response:
{
  "emotions": {
    "joy": 0.85,
    "confidence": 0.12,
    "surprise": 0.03
  },
  "sentiment": "positive",
  "confidence_score": 0.94
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">3. SDK disponibles</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {['JavaScript', 'Python', 'PHP', 'Ruby', 'Go', 'Java'].map((lang) => (
                      <div key={lang} className="p-3 border rounded text-center">
                        <Code className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">{lang}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilisation */}
          <TabsContent value="usage" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Requêtes ce mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,847</div>
                  <div className="text-sm text-muted-foreground">+23% vs mois dernier</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Temps de réponse moyen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">87ms</div>
                  <div className="text-sm text-muted-foreground">Excellent</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Taux de succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">99.2%</div>
                  <div className="text-sm text-muted-foreground">28 derniers jours</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Limites de taux</CardTitle>
                <CardDescription>
                  Limites actuelles pour votre plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Requêtes par minute</span>
                    <Badge>1000/min</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Requêtes par jour</span>
                    <Badge>100,000/jour</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Taille max par requête</span>
                    <Badge>5MB</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}