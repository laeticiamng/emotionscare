import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, BarChart3, BookOpen, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserMode } from '@/contexts/UserModeContext';

interface ScanPageHeaderProps {
  showScanForm: boolean;
  activeTab: string;
  setShowScanForm: (show: boolean) => void;
}

const ScanPageHeader: React.FC<ScanPageHeaderProps> = ({ 
  showScanForm,
  activeTab,
  setShowScanForm
}) => {
  const navigate = useNavigate();
  const { userMode } = useUserMode();
  
  const getFormattedPath = (path: string) => {
    // Utiliser les routes canoniques
    return `/app/${path}`;
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scanner d'émotions</h1>
        <p className="text-muted-foreground">
          Analysez et suivez votre bien-être émotionnel
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
        {!showScanForm && activeTab !== 'scan' && (
          <Button 
            onClick={() => {
              setShowScanForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle analyse
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => navigate(getFormattedPath('journal'))}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Journal</span>
          <span className="inline sm:hidden">Journal</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(getFormattedPath('dashboard'))}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Tableau de bord</span>
          <span className="inline sm:hidden">Dashboard</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate(getFormattedPath('coach'))}
        >
          <Brain className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Coach</span>
          <span className="inline sm:hidden">Coach</span>
        </Button>
      </div>
    </div>
  );
};

export default ScanPageHeader;
