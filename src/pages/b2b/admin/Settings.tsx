
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const B2BAdminSettings = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Les paramètres de l'organisation ont été mis à jour avec succès."
    });
  };
  
  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Paramètres administrateur</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres globaux pour votre organisation
        </p>
      </div>
      
      <Tabs defaultValue="organization">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="organization">Organisation</TabsTrigger>
          <TabsTrigger value="branding">Personnalisation</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="data">Données</TabsTrigger>
        </TabsList>
        
        <TabsContent value="organization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'organisation</CardTitle>
              <CardDescription>
                Configurez les informations de base de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company-name">Nom de l'entreprise</Label>
                    <Input id="company-name" defaultValue="EmotionsCare Enterprise" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Select defaultValue="technology">
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Sélectionnez un secteur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technologie</SelectItem>
                        <SelectItem value="healthcare">Santé</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="manufacturing">Industrie</SelectItem>
                        <SelectItem value="retail">Commerce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company-size">Taille de l'entreprise</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="company-size">
                        <SelectValue placeholder="Sélectionnez une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Petite (1-50 employés)</SelectItem>
                        <SelectItem value="medium">Moyenne (51-500 employés)</SelectItem>
                        <SelectItem value="large">Grande (501-5000 employés)</SelectItem>
                        <SelectItem value="enterprise">Très grande (5000+ employés)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleSave}>Enregistrer les informations</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Structure organisationnelle</CardTitle>
              <CardDescription>
                Gérez les départements et équipes de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Départements</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>Ressources Humaines</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>Marketing</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>Développement</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full">+ Ajouter un département</Button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Équipes</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>RH - Recrutement</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>Marketing - Digital</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <span>Dev - Frontend</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full">+ Ajouter une équipe</Button>
                  </div>
                </div>
                
                <Button onClick={handleSave}>Enregistrer la structure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personnalisation de la marque</CardTitle>
              <CardDescription>
                Personnalisez l'apparence de la plateforme pour votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="primary-color">Couleur principale</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="primary-color" defaultValue="#0070f3" className="w-12 h-10 p-1" />
                      <Input defaultValue="#0070f3" className="flex-1" />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="secondary-color">Couleur secondaire</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="secondary-color" defaultValue="#f5a623" className="w-12 h-10 p-1" />
                      <Input defaultValue="#f5a623" className="flex-1" />
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid gap-2">
                    <Label>Logo de l'entreprise</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center">
                      <div className="h-24 w-24 border rounded flex items-center justify-center mb-4">
                        Logo Preview
                      </div>
                      <Button variant="outline" size="sm">Télécharger un logo</Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSave}>Enregistrer la personnalisation</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'interface</CardTitle>
              <CardDescription>
                Configurez l'interface utilisateur pour votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Thème sombre par défaut</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser le thème sombre par défaut pour tous les utilisateurs
                    </p>
                  </div>
                  <Switch id="dark-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="custom-fonts">Police personnalisée</Label>
                    <p className="text-sm text-muted-foreground">
                      Utiliser des polices personnalisées dans l'interface
                    </p>
                  </div>
                  <Switch id="custom-fonts" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-company-name">Afficher le nom de l'entreprise</Label>
                    <p className="text-sm text-muted-foreground">
                      Afficher le nom de l'entreprise dans l'en-tête
                    </p>
                  </div>
                  <Switch id="show-company-name" defaultChecked />
                </div>
                
                <Button onClick={handleSave}>Enregistrer les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les paramètres de sécurité pour votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enforce-2fa">Exiger l'authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Tous les utilisateurs devront configurer l'authentification à deux facteurs
                    </p>
                  </div>
                  <Switch id="enforce-2fa" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session-timeout">Expiration de session automatique</Label>
                    <p className="text-sm text-muted-foreground">
                      Déconnecter automatiquement les utilisateurs après une période d'inactivité
                    </p>
                  </div>
                  <Switch id="session-timeout" defaultChecked />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="timeout-duration">Durée avant expiration (minutes)</Label>
                  <Input id="timeout-duration" type="number" defaultValue="30" min="5" max="240" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="password-policy">Politique de mot de passe</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Sélectionnez une politique" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (8 caractères min.)</SelectItem>
                      <SelectItem value="strong">Fort (10 caractères, majuscules, chiffres)</SelectItem>
                      <SelectItem value="very-strong">Très fort (12 caractères, majuscules, chiffres, symboles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleSave}>Enregistrer les paramètres de sécurité</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des données</CardTitle>
              <CardDescription>
                Gérez les données de votre organisation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-anonymization">Anonymisation des données</Label>
                    <p className="text-sm text-muted-foreground">
                      Anonymiser les données sensibles dans les rapports
                    </p>
                  </div>
                  <Switch id="data-anonymization" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-retention">Conservation limitée des données</Label>
                    <p className="text-sm text-muted-foreground">
                      Supprimer automatiquement les données après une période définie
                    </p>
                  </div>
                  <Switch id="data-retention" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="retention-period">Période de conservation (jours)</Label>
                  <Input id="retention-period" type="number" defaultValue="365" min="30" max="730" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="export-allowed">Autoriser l'export de données</Label>
                    <p className="text-sm text-muted-foreground">
                      Permettre aux utilisateurs d'exporter leurs données
                    </p>
                  </div>
                  <Switch id="export-allowed" defaultChecked />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Actions sur les données</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline">Exporter toutes les données</Button>
                    <Button variant="outline">Générer un rapport RGPD</Button>
                    <Button variant="destructive">Purger les données inactives</Button>
                  </div>
                </div>
                
                <Button onClick={handleSave}>Enregistrer la configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2BAdminSettings;
