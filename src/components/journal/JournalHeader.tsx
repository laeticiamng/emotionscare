// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JournalHeaderProps {
  selectedPeriod: 'all' | 'month' | 'week';
  setSelectedPeriod: (period: 'all' | 'month' | 'week') => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({ selectedPeriod, setSelectedPeriod }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold">Journal guidé</h1>
        <p className="text-muted-foreground">Suivez l'évolution de vos émotions et pensées</p>
      </div>
      
      <div className="flex gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              {selectedPeriod === 'all' ? 'Toutes les entrées' : 
               selectedPeriod === 'month' ? 'Dernier mois' : 'Dernière semaine'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedPeriod('all')}>
              Toutes les entrées
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod('month')}>
              Dernier mois
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedPeriod('week')}>
              Dernière semaine
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={() => navigate('/app/journal/new')} className="flex items-center gap-2">
          <Plus size={18} /> Nouvelle entrée
        </Button>
      </div>
    </div>
  );
};

export default JournalHeader;
