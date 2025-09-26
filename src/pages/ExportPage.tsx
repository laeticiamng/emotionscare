import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileText, 
  Table, 
  Database,
  CheckCircle,
  Clock,
} from 'lucide-react';

const ExportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Export des Données
          </h1>
          <p className="text-muted-foreground mt-2">
            Exportez vos données de bien-être dans différents formats
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Configuration de l'export */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sélection des données
                </CardTitle>
                <CardDescription>
                  Choisissez les types de données à inclure dans l'export
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {[
                    { id: 'scans', label: 'Scans émotionnels', description: 'Historique des analyses d\'émotions' },
                    { id: 'music', label: 'Sessions musicales', description: 'Données des sessions de musicothérapie' },
                    { id: 'journal', label: 'Entrées de journal', description: 'Contenus du journal vocal et écrit' },
                    { id: 'vr', label: 'Sessions VR', description: 'Historique des expériences de réalité virtuelle' },
                    { id: 'coach', label: 'Interactions IA', description: 'Conversations avec le coach IA' },
                    { id: 'wellbeing', label: 'Scores de bien-être', description: 'Évolution des métriques de bien-être' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-start space-x-3">
                      <Checkbox id={item.id} defaultChecked />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor={item.id} className="font-medium">
                          {item.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="dateFrom">Date de début</Label>
                    <input
                      id="dateFrom"
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTo">Date de fin</Label>
                    <input
                      id="dateTo"
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Format d'export
                </CardTitle>
                <CardDescription>
                  Sélectionnez le format de fichier souhaité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center space-x-3">
                    <input type="radio" id="csv" name="format" value="csv" defaultChecked />
                    <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                      <Table className="h-4 w-4" />
                      CSV (Comma Separated Values)
                      <Badge variant="secondary">Recommandé</Badge>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="radio" id="json" name="format" value="json" />
                    <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="h-4 w-4" />
                      JSON (JavaScript Object Notation)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu et actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu de l'export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>Types de données:</strong> 6 sélectionnés</p>
                  <p><strong>Période:</strong> 30 derniers jours</p>
                  <p><strong>Format:</strong> CSV</p>
                  <p><strong>Taille estimée:</strong> ~2.4 MB</p>
                </div>

                <Separator />

                <Button className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Lancer l'export
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Exports récents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    id: 1,
                    name: 'Export_Complet_2024-01-15.csv',
                    date: '15 jan 2024',
                    status: 'completed',
                    size: '3.2 MB'
                  },
                  {
                    id: 2,
                    name: 'Rapport_Mensuel_Decembre.csv',
                    date: '01 jan 2024',
                    status: 'completed',
                    size: '1.8 MB'
                  }
                ].map((export_) => (
                  <div key={export_.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{export_.name}</p>
                      <p className="text-xs text-muted-foreground">{export_.date} • {export_.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportPage;