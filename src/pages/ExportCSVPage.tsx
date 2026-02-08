import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileSpreadsheet, Download, ArrowLeft } from 'lucide-react';

export default function ExportCSVPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Export CSV</h1>
        <p className="text-muted-foreground">
          Exportez vos données au format CSV pour analyse
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Configuration d'export</h3>
            <p className="text-sm text-muted-foreground">
              Choisissez les données à exporter
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Type de données</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emotions">Scans émotionnels</SelectItem>
                <SelectItem value="journal">Journal</SelectItem>
                <SelectItem value="stats">Statistiques</SelectItem>
                <SelectItem value="goals">Objectifs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Période</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
                <SelectItem value="all">Toutes les données</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Télécharger le CSV
        </Button>
      </Card>
    </div>
  );
}
