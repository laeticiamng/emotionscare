import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, ArrowLeft } from 'lucide-react';

export default function ExportPDFPage() {
  const sections = [
    'Journal émotionnel',
    'Statistiques mensuelles',
    'Objectifs et progrès',
    'Sessions de coaching',
    'Analyses vocales',
    'Historique des scans',
  ];

  return (
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <Link to="/app/home" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Export PDF</h1>
        <p className="text-muted-foreground">
          Exportez vos données au format PDF
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Rapport complet</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez les sections à inclure
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox id={`section-${i}`} defaultChecked />
              <Label htmlFor={`section-${i}`} className="cursor-pointer">
                {section}
              </Label>
            </div>
          ))}
        </div>

        <Button className="w-full" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Télécharger le PDF
        </Button>
      </Card>
    </div>
  );
}
