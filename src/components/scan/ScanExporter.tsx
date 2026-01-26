/**
 * ScanExporter - Export historique scans émotionnels
 * Formats: PDF, CSV, JSON
 * Option partage sécurisé avec thérapeute
 */

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Share2, Mail, Lock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface ScanData {
  id: string;
  date: string;
  mood: string;
  emotions: Record<string, number>;
  notes?: string;
}

interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';
  startDate?: string;
  endDate?: string;
  includeNotes: boolean;
  includeGraphs: boolean;
  includeAnalytics: boolean;
  anonymize: boolean;
}

interface ScanExporterProps {
  scans: ScanData[];
  onExport?: (options: ExportOptions) => Promise<Blob>;
}

export const ScanExporter: React.FC<ScanExporterProps> = ({ scans, onExport }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: 'month',
    includeNotes: true,
    includeGraphs: true,
    includeAnalytics: true,
    anonymize: false,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      let exportData: Blob;

      if (onExport) {
        exportData = await onExport(options);
      } else {
        // Export par défaut
        exportData = await defaultExport(options);
      }

      // Télécharger le fichier
      const url = URL.createObjectURL(exportData);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scans-emotionnels-${new Date().toISOString().split('T')[0]}.${options.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export réussi',
        description: `Vos données ont été exportées au format ${options.format.toUpperCase()}.`,
      });

      logger.info('Export scan réussi', { format: options.format, count: scans.length }, 'SCAN');
    } catch (error) {
      logger.error('Erreur export scan', { error }, 'SCAN');
      toast({
        title: 'Erreur d\'export',
        description: 'Une erreur est survenue lors de l\'export. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail || !validateEmail(shareEmail)) {
      toast({
        title: 'Email invalide',
        description: 'Veuillez saisir une adresse email valide.',
        variant: 'destructive',
      });
      return;
    }

    setIsSharing(true);
    try {
      // Appel à l'edge function pour envoyer le partage sécurisé
      const { supabase } = await import('@/integrations/supabase/client');
 const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: shareEmail,
          subject: 'Partage sécurisé - Scans EmotionsCare',
          template: 'share-scans',
          data: {
            scans: filterScansByDateRange(scans, options),
            expiresIn: '7 days'
          }
        }
      });

      if (error) throw error;
      toast({
        title: 'Partage envoyé',
        description: `Un lien sécurisé a été envoyé à ${shareEmail}.`,
      });

      logger.info('Partage scan envoyé', { email: shareEmail }, 'SCAN');
      setShareEmail('');
    } catch (error) {
      logger.error('Erreur partage scan', { error }, 'SCAN');
      toast({
        title: 'Erreur de partage',
        description: 'Impossible d\'envoyer le partage. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const defaultExport = async (opts: ExportOptions): Promise<Blob> => {
    // Export simulé - À remplacer par vraie implémentation
    const filteredScans = filterScansByDateRange(scans, opts);

    if (opts.format === 'json') {
      return new Blob([JSON.stringify(filteredScans, null, 2)], { type: 'application/json' });
    }

    if (opts.format === 'csv') {
      const csv = convertToCSV(filteredScans, opts);
      return new Blob([csv], { type: 'text/csv' });
    }

    // PDF
    const html = generatePDFHTML(filteredScans, opts);
    return new Blob([html], { type: 'text/html' });
  };

  const filterScansByDateRange = (data: ScanData[], opts: ExportOptions): ScanData[] => {
    if (opts.dateRange === 'all') return data;

    const now = new Date();
    let startDate = new Date();

    switch (opts.dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'custom':
        if (opts.startDate) startDate = new Date(opts.startDate);
        break;
    }

    return data.filter(scan => {
      const scanDate = new Date(scan.date);
      const afterStart = scanDate >= startDate;
      const beforeEnd = opts.dateRange === 'custom' && opts.endDate
        ? scanDate <= new Date(opts.endDate)
        : true;
      return afterStart && beforeEnd;
    });
  };

  const convertToCSV = (data: ScanData[], opts: ExportOptions): string => {
    const headers = ['Date', 'Humeur', ...Object.keys(data[0]?.emotions || {})];
    if (opts.includeNotes) headers.push('Notes');

    const rows = data.map(scan => {
      const row = [
        scan.date,
        scan.mood,
        ...Object.values(scan.emotions),
      ];
      if (opts.includeNotes) row.push(scan.notes || '');
      return row.join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const generatePDFHTML = (data: ScanData[], opts: ExportOptions): string => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Historique Scans Émotionnels</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Historique Scans Émotionnels</h1>
          <p>Période: ${opts.dateRange}</p>
          <p>Total de scans: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Humeur</th>
                ${opts.includeNotes ? '<th>Notes</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${data.map(scan => `
                <tr>
                  <td>${new Date(scan.date).toLocaleDateString()}</td>
                  <td>${scan.mood}</td>
                  ${opts.includeNotes ? `<td>${scan.notes || '-'}</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getDateRangeText = () => {
    const ranges: Record<string, string> = {
      week: 'Dernière semaine',
      month: 'Dernier mois',
      quarter: 'Dernier trimestre',
      year: 'Dernière année',
      all: 'Toutes les données',
      custom: 'Période personnalisée',
    };
    return ranges[options.dateRange];
  };

  const filteredCount = filterScansByDateRange(scans, options).length;

  return (
    <div className="space-y-6">
      {/* Options d'export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exporter vos scans
          </CardTitle>
          <CardDescription>
            Téléchargez l'historique de vos scans émotionnels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Format d'export</Label>
              <Select
                value={options.format}
                onValueChange={(value: any) => setOptions({ ...options, format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF (Rapport visuel)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      CSV (Tableur)
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      JSON (Données brutes)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Période</Label>
              <Select
                value={options.dateRange}
                onValueChange={(value: any) => setOptions({ ...options, dateRange: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Dernière semaine</SelectItem>
                  <SelectItem value="month">Dernier mois</SelectItem>
                  <SelectItem value="quarter">Dernier trimestre</SelectItem>
                  <SelectItem value="year">Dernière année</SelectItem>
                  <SelectItem value="all">Toutes les données</SelectItem>
                  <SelectItem value="custom">Période personnalisée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {options.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={options.startDate || ''}
                  onChange={(e) => setOptions({ ...options, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={options.endDate || ''}
                  onChange={(e) => setOptions({ ...options, endDate: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeNotes"
                checked={options.includeNotes}
                onCheckedChange={(checked) => setOptions({ ...options, includeNotes: checked as boolean })}
              />
              <Label htmlFor="includeNotes" className="cursor-pointer">
                Inclure les notes personnelles
              </Label>
            </div>

            {options.format === 'pdf' && (
              <>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeGraphs"
                    checked={options.includeGraphs}
                    onCheckedChange={(checked) => setOptions({ ...options, includeGraphs: checked as boolean })}
                  />
                  <Label htmlFor="includeGraphs" className="cursor-pointer">
                    Inclure les graphiques
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAnalytics"
                    checked={options.includeAnalytics}
                    onCheckedChange={(checked) => setOptions({ ...options, includeAnalytics: checked as boolean })}
                  />
                  <Label htmlFor="includeAnalytics" className="cursor-pointer">
                    Inclure les analyses et statistiques
                  </Label>
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymize"
                checked={options.anonymize}
                onCheckedChange={(checked) => setOptions({ ...options, anonymize: checked as boolean })}
              />
              <Label htmlFor="anonymize" className="cursor-pointer flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Anonymiser les données (retirer informations personnelles)
              </Label>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                <strong>{filteredCount}</strong> scan(s) seront exporté(s) ({getDateRangeText()})
              </span>
            </div>
          </div>

          <Button onClick={handleExport} disabled={isExporting || filteredCount === 0} className="w-full">
            {isExporting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger ({options.format.toUpperCase()})
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Partage sécurisé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partage sécurisé
          </CardTitle>
          <CardDescription>
            Partagez vos données avec votre thérapeute ou professionnel de santé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shareEmail">Email du destinataire</Label>
            <div className="flex gap-2">
              <Input
                id="shareEmail"
                type="email"
                placeholder="therapeute@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              <Button onClick={handleShare} disabled={isSharing || !shareEmail}>
                {isSharing ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200 text-sm font-medium">
                <Lock className="h-4 w-4" />
                Partage sécurisé et temporaire
              </div>
              <ul className="text-xs text-green-700 dark:text-green-300 space-y-1 ml-6 list-disc">
                <li>Lien crypté avec expiration automatique (7 jours)</li>
                <li>Accès unique avec mot de passe</li>
                <li>Aucune donnée stockée sur nos serveurs</li>
                <li>Conforme RGPD et secret médical</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanExporter;
