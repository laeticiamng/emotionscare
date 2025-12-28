/**
 * Bouton d'export des données Ambition Arcade
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useAmbitionExport } from '../hooks/useAmbitionExtras';

interface ExportButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  variant = 'outline', 
  size = 'sm',
  showLabel = true 
}) => {
  const { exportData, isExporting } = useAmbitionExport();

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={exportData}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {showLabel && (isExporting ? 'Export...' : 'Exporter')}
    </Button>
  );
};

export default ExportButton;
