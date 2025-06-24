
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle, Eye, Lock } from 'lucide-react';

const SecurityPage: React.FC = () => {
  const securityEvents = [
    { 
      id: 1, 
      type: 'login_attempt', 
      description: 'Tentative de connexion échouée', 
      user: 'user@example.com',
      timestamp: '2024-01-15 14:30:22',
      severity: 'medium',
      ip: '192.168.1.100'
    },
    { 
      id: 2, 
      type: 'password_change', 
      description: 'Changement de mot de passe', 
      user: 'admin@example.com',
      timestamp: '2024-01-15 13:15:10',
      severity: 'low',
      ip: '192.168.1.50'
    },
    { 
      id: 3, 
      type: 'suspicious_activity', 
      description: 'Activité suspecte détectée', 
      user: 'test@example.com',
      timestamp: '2024-01-15 12:45:33',
      severity: 'high',
      ip: '10.0.0.25'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sécurité & Conformité</h1>
          <p className="text-muted-foreground">
            Surveillance et gestion de la sécurité de la plateforme
          </p>
        </div>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Audit de Sécurité
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de Sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94/100</div>
            <p className="text-xs text-muted-foreground">Excellent niveau</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Actives</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">2</div>
            <p className="text-xs text-muted-foreground">Nécessitent attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connexions Échouées</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Dernières 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité RGPD</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">✓</div>
            <p className="text-xs text-muted-foreground">Conforme</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de Sécurité</CardTitle>
            <CardDescription>Configuration des mesures de protection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Obligatoire pour tous les administrateurs
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Chiffrement des données au repos</Label>
                <p className="text-sm text-muted-foreground">
                  AES-256 pour toutes les données sensibles
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Logs d'audit détaillés</Label>
                <p className="text-sm text-muted-foreground">
                  Enregistrement de toutes les actions utilisateur
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Protection contre les attaques par force brute</Label>
                <p className="text-sm text-muted-foreground">
                  Blocage automatique après 5 tentatives
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Scan de vulnérabilités automatique</Label>
                <p className="text-sm text-muted-foreground">
                  Analyse quotidienne des failles de sécurité
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Événements de Sécurité Récents</CardTitle>
            <CardDescription>Activités suspectes et tentatives d'intrusion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 border-b pb-3">
                  <div className="flex-shrink-0">
                    {event.severity === 'high' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : event.severity === 'medium' ? (
                      <Eye className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{event.description}</p>
                      <Badge variant={
                        event.severity === 'high' ? 'destructive' : 
                        event.severity === 'medium' ? 'default' : 'secondary'
                      }>
                        {event.severity === 'high' ? 'Critique' : 
                         event.severity === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Utilisateur: {event.user}</p>
                      <p>IP: {event.ip} • {event.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conformité et Certifications</CardTitle>
          <CardDescription>Status des certifications de sécurité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">RGPD</h4>
                <p className="text-sm text-muted-foreground">Conforme depuis 2018</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">ISO 27001</h4>
                <p className="text-sm text-muted-foreground">Certifié jusqu'en 2025</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h4 className="font-medium">SOC 2 Type II</h4>
                <p className="text-sm text-muted-foreground">Audit réussi en 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;
