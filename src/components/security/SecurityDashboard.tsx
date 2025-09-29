
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Download, Trash2, Settings } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

const SecurityDashboard: React.FC = () => {
  const { 
    metrics, 
    accessHistory, 
    exportSecurityData, 
    requestDataDeletion, 
    updateSecurityPreferences,
    loading 
  } = useSecurity();

  const getComplianceBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score de sécurité</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.securityScore}%</div>
            <p className="text-xs text-muted-foreground">
              Dernière connexion: {new Date(metrics.lastLogin).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.eventsCount}</div>
            <p className="text-xs text-muted-foreground">
              Accès enregistrés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conformité</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={getComplianceBadgeVariant(metrics.complianceLevel)}>
              {metrics.complianceLevel.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Niveau de conformité RGPD
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des accès</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {accessHistory.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex items-center gap-2">
                  <Badge variant={event.success ? 'default' : 'destructive'}>
                    {event.success ? 'Autorisé' : 'Refusé'}
                  </Badge>
                  <span className="text-sm">{event.page}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions de sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={exportSecurityData} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter les données
            </Button>
            
            <Button 
              onClick={requestDataDeletion} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer mes données
            </Button>
            
            <Button 
              onClick={() => updateSecurityPreferences({ notifications: true })} 
              disabled={loading}
              size="sm"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              Préférences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
