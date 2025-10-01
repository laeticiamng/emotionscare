// @ts-nocheck

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileType, FileImage, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SynthesisExportProps {
  title: string;
  description?: string;
}

type ExportFormat = 'pdf' | 'image' | 'csv' | 'json';

interface ExportOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const exportOptions: ExportOption[] = [
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Document portable facile à partager',
    icon: <FileText className="h-6 w-6 text-red-500" />
  },
  {
    id: 'image',
    label: 'Image (PNG)',
    description: 'Capture visuelle haute résolution',
    icon: <FileImage className="h-6 w-6 text-blue-500" />
  },
  {
    id: 'csv',
    label: 'CSV',
    description: 'Données tabulaires pour Excel/Google Sheets',
    icon: <FileType className="h-6 w-6 text-green-500" />
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'Format de données structuré',
    icon: <FileType className="h-6 w-6 text-yellow-500" />
  }
];

const SynthesisExport: React.FC<SynthesisExportProps> = ({ title, description }) => {
  const [open, setOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setOpen(false);
      
      toast({
        title: "Export réussi",
        description: `Le fichier a été exporté au format ${selectedFormat.toUpperCase()}`,
      });
    }, 1500);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        variant="outline"
        className="gap-1"
      >
        <Download className="h-4 w-4" />
        Exporter
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exporter {title}</DialogTitle>
            <DialogDescription>
              {description || "Choisissez le format d'export souhaité."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <RadioGroup 
              value={selectedFormat} 
              onValueChange={(value) => setSelectedFormat(value as ExportFormat)}
              className="space-y-3"
            >
              {exportOptions.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 rounded-md border p-3 transition-all ${
                    selectedFormat === option.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/25'
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <Label
                    htmlFor={option.id}
                    className="flex flex-1 items-center cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {option.icon}
                    </div>
                    <div className="ml-3 space-y-1">
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isExporting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                  />
                  Exportation...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exporter
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SynthesisExport;
