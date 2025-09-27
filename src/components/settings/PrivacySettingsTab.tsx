import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database,
  Share2,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Users,
  UserCheck,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PrivacySettingsTab: React.FC = () => {
  const { toast } = useToast();
  
  const [dataSettings, setDataSettings] = useState({
    analytics: true,
    personalization: true,
    advertising: false,
    research: true,
    sharing: false
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    profileVisibility: 'public',
    activityStatus: true,
    lastSeen: false,
    progressSharing: 'friends',
    sessionsPublic: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30',
    deviceTracking: true
  });

  const privacyScore = 75; // Calcul basé sur les paramètres

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "Vos données seront envoyées par email dans les 24h."
    });
  };

  const handleDeleteData = () => {
    toast({
      title: "Suppression programmée",
      description: "Un email de confirmation va être envoyé.",
      variant: "destructive"
    });
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Score de confidentialité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Score de confidentialité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{privacyScore}/100</div>
              <p className="text-sm text-muted-foreground">
                Niveau de protection de vos données
              </p>
            </div>
            <div className="w-24 h-24 relative">
              <Progress value={privacyScore} className="h-2" />
              <Badge className={`absolute top-0 right-0 ${getPrivacyScoreColor(privacyScore)}`}>
                {privacyScore >= 80 ? 'Excellent' : privacyScore >= 60 ? 'Bon' : 'À améliorer'}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Chiffrement end-to-end
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Données anonymisées
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Partage limité
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Contrôle utilisateur
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visibilité du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visibilité du profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Visibilité du profil</Label>
              <p className="text-sm text-muted-foreground">
                Qui peut voir votre profil et vos informations
              </p>
            </div>
            <Select 
              value={visibilitySettings.profileVisibility}
              onValueChange={(value) => setVisibilitySettings({...visibilitySettings, profileVisibility: value})}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="friends">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Amis
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Privé
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Statut d'activité</Label>
              <p className="text-sm text-muted-foreground">
                Montrer quand vous êtes en ligne
              </p>
            </div>
            <Switch
              checked={visibilitySettings.activityStatus}
              onCheckedChange={(checked) => setVisibilitySettings({...visibilitySettings, activityStatus: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dernière connexion</Label>
              <p className="text-sm text-muted-foreground">
                Afficher votre dernière connexion
              </p>
            </div>
            <Switch
              checked={visibilitySettings.lastSeen}
              onCheckedChange={(checked) => setVisibilitySettings({...visibilitySettings, lastSeen: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Partage des progrès</Label>
              <p className="text-sm text-muted-foreground">
                Qui peut voir vos statistiques de bien-être
              </p>
            </div>
            <Select 
              value={visibilitySettings.progressSharing}
              onValueChange={(value) => setVisibilitySettings({...visibilitySettings, progressSharing: value})}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Amis</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Utilisation des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Utilisation des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics et amélioration</Label>
              <p className="text-sm text-muted-foreground">
                Aider à améliorer l'application avec des données anonymes
              </p>
            </div>
            <Switch
              checked={dataSettings.analytics}
              onCheckedChange={(checked) => setDataSettings({...dataSettings, analytics: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Personnalisation IA</Label>
              <p className="text-sm text-muted-foreground">
                Utiliser vos données pour personnaliser l'expérience IA
              </p>
            </div>
            <Switch
              checked={dataSettings.personalization}
              onCheckedChange={(checked) => setDataSettings({...dataSettings, personalization: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Recherche médicale</Label>
              <p className="text-sm text-muted-foreground">
                Contribuer à la recherche en santé mentale (anonyme)
              </p>
            </div>
            <Switch
              checked={dataSettings.research}
              onCheckedChange={(checked) => setDataSettings({...dataSettings, research: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Publicité personnalisée</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des publicités basées sur vos intérêts
              </p>
            </div>
            <Switch
              checked={dataSettings.advertising}
              onCheckedChange={(checked) => setDataSettings({...dataSettings, advertising: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sécurité avancée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sécurité avancée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                Authentification à deux facteurs
                <Badge variant="outline" className="text-xs">Recommandé</Badge>
              </Label>
              <p className="text-sm text-muted-foreground">
                Ajouter une couche de sécurité supplémentaire
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactor}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactor: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Alertes de connexion</Label>
              <p className="text-sm text-muted-foreground">
                Notification lors de nouvelles connexions
              </p>
            </div>
            <Switch
              checked={securitySettings.loginAlerts}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginAlerts: checked})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Timeout de session</Label>
              <p className="text-sm text-muted-foreground">
                Déconnexion automatique après inactivité
              </p>
            </div>
            <Select 
              value={securitySettings.sessionTimeout}
              onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15min</SelectItem>
                <SelectItem value="30">30min</SelectItem>
                <SelectItem value="60">1h</SelectItem>
                <SelectItem value="0">Jamais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des données */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Gestion des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleExportData} className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Exporter mes données
            </Button>
            <Button variant="outline" className="justify-start">
              <UserCheck className="h-4 w-4 mr-2" />
              Portabilité des données
            </Button>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Zone dangereuse</h4>
                <p className="text-sm text-red-600 mb-3">
                  Supprimer définitivement toutes vos données de nos serveurs.
                  Cette action est irréversible.
                </p>
                <Button variant="destructive" size="sm" onClick={handleDeleteData}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer mes données
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySettingsTab;