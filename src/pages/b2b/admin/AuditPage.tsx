
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Download, Eye, User, Calendar, Activity } from 'lucide-react';

const AuditPage: React.FC = () => {
  const auditLogs = [
    { 
      id: 1, 
      action: 'user_login', 
      user: 'marie.dupont@example.com',
      timestamp: '2024-01-15 14:30:22',
      ip: '192.168.1.100',
      details: 'Connexion réussie depuis Chrome',
      severity: 'info'
    },
    { 
      id: 2, 
      action: 'data_export', 
      user: 'admin@example.com',
      timestamp: '2024-01-15 13:15:10',
      ip: '192.168.1.50',
      details: 'Export des données utilisateur ID:1234',
      severity: 'medium'
    },
    { 
      id: 3, 
      action: 'settings_change', 
      user: 'jean.martin@example.com',
      timestamp: '2024-01-15 12:45:33',
      ip: '10.0.0.25',
      details: 'Modification des paramètres de notification',
      severity: 'low'
    },
    { 
      id: 4, 
      action: 'failed_login', 
      user: 'suspicious@example.com',
      timestamp: '2024-01-15 11:20:15',
      ip: '203.0.113.15',
      details: 'Tentative de connexion échouée (5e tentative)',
      severity: 'high'
    },
    { 
      id: 5, 
      action: 'user_deletion', 
      user: 'admin@example.com',
      timestamp: '2024-01-15 10:30:00',
      ip: '192.168.1.50',
      details: 'Suppression compte utilisateur ID:5678',
      severity: 'high'
    },
  ];

  const actionTypes = [
    { type: 'user_login', label: 'Connexions', count: 1247, icon: User },
    { type: 'data_access', label: 'Accès aux données', count: 89, icon: Eye },
    { type: 'settings_change', label: 'Modifications', count: 156, icon: Activity },
    { type: 'export', label: 'Exports', count: 23, icon: Download },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journaux d'Audit</h1>
          <p className="text-muted-foreground">
            Surveillance et traçabilité de toutes les activités système
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Analyse en Temps Réel
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actionTypes.map((actionType) => {
          const IconComponent = actionType.icon;
          return (
            <Card key={actionType.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{actionType.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionType.count}</div>
                <p className="text-xs text-muted-foreground">Dernières 24h</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Historique des actions effectuées sur la plateforme</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les logs..."
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 border-b pb-4">
                <div className="flex-shrink-0 mt-1">
                  {log.severity === 'high' ? (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  ) : log.severity === 'medium' ? (
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  ) : log.severity === 'low' ? (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">
                      {log.action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <Badge variant={
                      log.severity === 'high' ? 'destructive' : 
                      log.severity === 'medium' ? 'default' : 
                      log.severity === 'low' ? 'secondary' : 'outline'
                    }>
                      {log.severity === 'high' ? 'Critique' : 
                       log.severity === 'medium' ? 'Important' : 
                       log.severity === 'low' ? 'Mineur' : 'Info'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.details}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                    <span>IP: {log.ip}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration de l'Audit</CardTitle>
          <CardDescription>Paramètres de journalisation et de rétention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Types d'événements surveillés</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Connexions et déconnexions</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Accès aux données sensibles</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Modifications des paramètres</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Actions administratives</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Activité de navigation</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Paramètres de rétention</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Logs de sécurité</label>
                  <select className="w-full mt-1 border rounded-md px-3 py-2">
                    <option value="7years">7 ans (recommandé)</option>
                    <option value="5years">5 ans</option>
                    <option value="3years">3 ans</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Logs d'activité</label>
                  <select className="w-full mt-1 border rounded-md px-3 py-2">
                    <option value="2years">2 ans</option>
                    <option value="1year">1 an</option>
                    <option value="6months">6 mois</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
