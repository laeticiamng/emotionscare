import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Filter, Plus, Search, Calendar, Flame, FileText, X, Download, TrendingUp, TrendingDown, Minus, SortAsc, SortDesc, FileDown, LayoutTemplate, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface JournalHeaderProps {
  selectedPeriod: 'all' | 'month' | 'week';
  setSelectedPeriod: (period: 'all' | 'month' | 'week') => void;
  totalEntries?: number;
  currentStreak?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  entries?: Array<{ id: string; title?: string; content?: string; emotion?: string; created_at?: string }>;
  moodTrend?: 'up' | 'down' | 'stable';
  sortOrder?: 'newest' | 'oldest';
  onSortChange?: (order: 'newest' | 'oldest') => void;
}

const TEMPLATES = [
  { id: 'gratitude', name: 'Gratitude', icon: '🙏', description: '3 choses pour lesquelles je suis reconnaissant' },
  { id: 'reflection', name: 'Réflexion du soir', icon: '🌙', description: 'Bilan de ma journée' },
  { id: 'goals', name: 'Objectifs', icon: '🎯', description: 'Mes intentions pour la journée' },
  { id: 'emotions', name: 'Check-in émotionnel', icon: '💭', description: 'Explorer mes émotions actuelles' },
];

const JournalHeader: React.FC<JournalHeaderProps> = ({ 
  selectedPeriod, 
  setSelectedPeriod,
  totalEntries = 0,
  currentStreak = 0,
  searchQuery = '',
  onSearchChange,
  entries = [],
  moodTrend = 'stable',
  sortOrder = 'newest',
  onSortChange,
}) => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const getMoodTrendIcon = () => {
    if (moodTrend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (moodTrend === 'down') return <TrendingDown className="h-3 w-3 text-orange-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const handleExportCSV = () => {
    if (entries.length === 0) {
      toast.error('Aucune entrée à exporter');
      return;
    }

    const csvContent = [
      ['Date', 'Titre', 'Émotion', 'Contenu'].join(','),
      ...entries.map(e => [
        e.created_at ? new Date(e.created_at).toLocaleDateString('fr-FR') : '',
        `"${(e.title || '').replace(/"/g, '""')}"`,
        e.emotion || '',
        `"${(e.content || '').replace(/"/g, '""').slice(0, 200)}..."`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Journal exporté en CSV');
    setShowExport(false);
  };

  const handleExportText = () => {
    if (entries.length === 0) {
      toast.error('Aucune entrée à exporter');
      return;
    }

    const textContent = entries.map(e => 
      `=== ${e.created_at ? new Date(e.created_at).toLocaleDateString('fr-FR') : 'Sans date'} ===\n${e.title || 'Sans titre'}\nÉmotion: ${e.emotion || 'Non spécifiée'}\n\n${e.content || ''}\n\n`
    ).join('\n---\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Journal exporté en texte');
    setShowExport(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    navigate(`/app/journal-new?template=${templateId}`);
    setShowTemplates(false);
  };

  const handleShare = async () => {
    const shareText = `J'ai écrit ${totalEntries} entrées dans mon journal et maintenu une série de ${currentStreak} jours ! 📝✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        navigator.clipboard.writeText(shareText);
        toast.success('Texte copié !');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Texte copié !');
    }
  };
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Journal guidé</h1>
          <p className="text-muted-foreground">Suivez l'évolution de vos émotions et pensées</p>
          
          {/* Quick stats with trend */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {totalEntries > 0 && (
              <Badge variant="secondary" className="gap-1 cursor-pointer hover:bg-secondary/80" onClick={handleShare}>
                <FileText className="h-3 w-3" />
                {totalEntries} entrées
                {getMoodTrendIcon()}
              </Badge>
            )}
            {currentStreak > 0 && (
              <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                <Flame className="h-3 w-3" />
                {currentStreak} jours
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={handleShare}>
              <Share2 className="h-3 w-3 mr-1" />
              Partager
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
            className={cn(showSearch && 'bg-primary/10')}
            aria-label="Rechercher"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Sort order */}
          {onSortChange && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
              aria-label={sortOrder === 'newest' ? 'Trier du plus ancien' : 'Trier du plus récent'}
            >
              {sortOrder === 'newest' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
            </Button>
          )}

          {/* Export button */}
          <Button variant="outline" size="icon" onClick={() => setShowExport(true)} aria-label="Exporter">
            <Download className="h-4 w-4" />
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

          {/* Templates button */}
          <Button variant="outline" onClick={() => setShowTemplates(true)} className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            <span className="hidden sm:inline">Modèles</span>
          </Button>
          
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
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choisir un modèle</DialogTitle>
            <DialogDescription>Sélectionnez un modèle pour guider votre écriture</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {TEMPLATES.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto p-4 justify-start text-left"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <span className="text-2xl mr-3">{template.icon}</span>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter le journal</DialogTitle>
            <DialogDescription>Choisissez le format d'export</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            <Button variant="outline" className="justify-start gap-3" onClick={handleExportCSV}>
              <FileDown className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export CSV</div>
                <div className="text-xs text-muted-foreground">Idéal pour Excel ou Google Sheets</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start gap-3" onClick={handleExportText}>
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export Texte</div>
                <div className="text-xs text-muted-foreground">Format lisible simple</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JournalHeader;
