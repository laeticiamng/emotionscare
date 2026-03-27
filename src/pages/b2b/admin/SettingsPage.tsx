// @ts-nocheck
/**
 * Page de paramètres B2B pour les organisations
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  Shield,
  Bell,
  FileText,
  Lock,
  Mail,
  Users,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const orgName = (user?.user_metadata?.org_name as string) || 'Votre organisation';

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/b2b/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h1 className="font-semibold">Paramètres</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Informations organisation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de l'organisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Nom de l'organisation</Label>
                  <Input id="org-name" value={orgName} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-type">Type</Label>
                  <Input id="org-type" value="Entreprise" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-seats">Nombre de places</Label>
                <Input id="max-seats" value="100" disabled />
                <p className="text-xs text-muted-foreground">
                  Contactez-nous pour modifier votre abonnement
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres de confidentialité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Confidentialité & Anonymisation
              </CardTitle>
              <CardDescription>
                Ces paramètres garantissent la protection des données de vos collaborateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Seuil d'anonymisation</Label>
                  <p className="text-sm text-muted-foreground">
                    Nombre minimum de participants pour afficher des données agrégées
                  </p>
                </div>
                <Badge variant="secondary">5 minimum</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Données individuelles</Label>
                  <p className="text-sm text-muted-foreground">
                    Les données personnelles ne sont jamais partagées
                  </p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/50">
                  <Lock className="h-3 w-3 mr-1" />
                  Protégé
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conformité RGPD</Label>
                  <p className="text-sm text-muted-foreground">
                    Traitement conforme au règlement européen
                  </p>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/50">
                  Conforme
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rapports mensuels</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un résumé mensuel par email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes d'adoption</Label>
                  <p className="text-sm text-muted-foreground">
                    Être notifié si le taux d'adoption baisse significativement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Rapports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rapports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fréquence des rapports</Label>
                  <p className="text-sm text-muted-foreground">
                    Génération automatique des rapports agrégés
                  </p>
                </div>
                <Badge variant="secondary">Mensuel</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Format d'export</Label>
                  <p className="text-sm text-muted-foreground">
                    Format des rapports téléchargeables
                  </p>
                </div>
                <Badge variant="secondary">PDF</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Administrateurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Administrateurs
              </CardTitle>
              <CardDescription>
                Gérez les accès au tableau de bord institutionnel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">Administrateur principal</p>
                    </div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Inviter un administrateur
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer éthique */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-4">
            <Shield className="h-3 w-3" />
            <span>
              EmotionsCare respecte la vie privée de vos collaborateurs • Aucune donnée
              individuelle n'est accessible
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
