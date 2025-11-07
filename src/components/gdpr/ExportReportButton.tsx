import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, FileSpreadsheet, Calendar as CalendarIcon, Printer } from 'lucide-react';
import { toast } from 'sonner';
import { exportGDPRReportCSV, printGDPRReport, exportGDPRReportJSON, ExportOptions } from '@/lib/gdpr-export';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ExportReportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [options, setOptions] = useState<Omit<ExportOptions, 'startDate' | 'endDate'>>({
    includeAlerts: true,
    includeConsents: true,
    includeExports: true,
    includeAuditLogs: true,
  });

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true);
    try {
      const exportOptions: ExportOptions = {
        ...options,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      };

      if (format === 'csv') {
        await exportGDPRReportCSV(exportOptions);
        toast.success('Rapport CSV exporté avec succès');
      } else if (format === 'json') {
        await exportGDPRReportJSON(exportOptions);
        toast.success('Rapport JSON exporté avec succès');
      } else {
        await printGDPRReport(exportOptions);
        toast.success('Rapport PDF prêt à imprimer', {
          description: 'Utilisez Ctrl+P ou Cmd+P pour sauvegarder en PDF'
        });
      }

      setIsOpen(false);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Erreur lors de l\'export du rapport');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exporter le rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exporter le rapport RGPD</DialogTitle>
          <DialogDescription>
            Générez un rapport de conformité RGPD complet au format CSV ou PDF
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Période */}
          <div className="space-y-4">
            <Label>Période du rapport</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP', { locale: fr }) : 'Sélectionner'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP', { locale: fr }) : 'Sélectionner'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Laissez vide pour inclure toutes les données
            </p>
          </div>

          {/* Sections à inclure */}
          <div className="space-y-4">
            <Label>Sections à inclure</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alerts"
                  checked={options.includeAlerts}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeAlerts: checked as boolean })
                  }
                />
                <label
                  htmlFor="alerts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Alertes RGPD
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consents"
                  checked={options.includeConsents}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeConsents: checked as boolean })
                  }
                />
                <label
                  htmlFor="consents"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Statistiques de consentements
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exports"
                  checked={options.includeExports}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeExports: checked as boolean })
                  }
                />
                <label
                  htmlFor="exports"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Demandes d'export de données
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="audit"
                  checked={options.includeAuditLogs}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, includeAuditLogs: checked as boolean })
                  }
                />
                <label
                  htmlFor="audit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Journaux d'audit
                </label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            disabled={isExporting}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={() => handleExport('pdf')} disabled={isExporting}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportReportButton;
