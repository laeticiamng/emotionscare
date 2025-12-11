import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Filter, Plus, Search, Calendar, Flame, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface JournalHeaderProps {
  selectedPeriod: 'all' | 'month' | 'week';
  setSelectedPeriod: (period: 'all' | 'month' | 'week') => void;
  totalEntries?: number;
  currentStreak?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const JournalHeader: React.FC<JournalHeaderProps> = ({ 
  selectedPeriod, 
  setSelectedPeriod,
  totalEntries = 0,
  currentStreak = 0,
  searchQuery = '',
  onSearchChange,
}) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Journal guidé</h1>
          <p className="text-muted-foreground">Suivez l'évolution de vos émotions et pensées</p>
          
          {/* Quick stats */}
          <div className="flex items-center gap-3 mt-2">
            {totalEntries > 0 && (
              <Badge variant="secondary" className="gap-1">
                <FileText className="h-3 w-3" />
                {totalEntries} entrées
              </Badge>
            )}
            {currentStreak > 0 && (
              <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                <Flame className="h-3 w-3" />
                {currentStreak} jours
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className={cn(showSearch && 'bg-primary/10')}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Period filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {selectedPeriod === 'all' ? 'Toutes' : 
                   selectedPeriod === 'month' ? 'Ce mois' : 'Cette semaine'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedPeriod('all')}>
                <Calendar className="h-4 w-4 mr-2" />
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
          
          <Button onClick={() => navigate('/app/journal-new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle entrée</span>
          </Button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && onSearchChange && (
        <div className="relative animate-fade-in">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos entrées..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-9"
            autoFocus
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default JournalHeader;
