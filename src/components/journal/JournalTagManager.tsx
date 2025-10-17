import { useState, useMemo } from 'react';
import { Tag, Edit2, Trash2, Plus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalTagManagerProps {
  notes: SanitizedNote[];
  onTagRenamed?: (oldTag: string, newTag: string) => void;
  onTagDeleted?: (tag: string) => void;
}

interface TagStats {
  name: string;
  count: number;
  lastUsed: Date;
}

/**
 * Gestionnaire de tags avec statistiques et actions
 * Permet de visualiser, renommer et supprimer des tags
 */
export function JournalTagManager({ notes, onTagRenamed, onTagDeleted }: JournalTagManagerProps) {
  const { toast } = useToast();
  const [selectedTag, setSelectedTag] = useState<TagStats | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculer les statistiques des tags
  const tagStats = useMemo((): TagStats[] => {
    const statsMap = new Map<string, { count: number; lastUsed: Date }>();

    notes.forEach(note => {
      const noteDate = new Date(note.created_at);
      note.tags.forEach(tag => {
        const existing = statsMap.get(tag);
        if (existing) {
          existing.count++;
          if (noteDate > existing.lastUsed) {
            existing.lastUsed = noteDate;
          }
        } else {
          statsMap.set(tag, { count: 1, lastUsed: noteDate });
        }
      });
    });

    return Array.from(statsMap.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        lastUsed: stats.lastUsed,
      }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  // Filtrer les tags par recherche
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) return tagStats;
    const query = searchQuery.toLowerCase();
    return tagStats.filter(tag => tag.name.toLowerCase().includes(query));
  }, [tagStats, searchQuery]);

  const handleRenameClick = (tag: TagStats) => {
    setSelectedTag(tag);
    setNewTagName(tag.name);
    setRenameDialogOpen(true);
  };

  const handleDeleteClick = (tag: TagStats) => {
    setSelectedTag(tag);
    setDeleteDialogOpen(true);
  };

  const handleRename = () => {
    if (!selectedTag || !newTagName.trim()) return;

    if (newTagName === selectedTag.name) {
      setRenameDialogOpen(false);
      return;
    }

    // Vérifier si le nouveau nom existe déjà
    if (tagStats.some(t => t.name === newTagName.trim())) {
      toast({
        title: 'Tag existant',
        description: 'Un tag avec ce nom existe déjà.',
        variant: 'destructive',
      });
      return;
    }

    onTagRenamed?.(selectedTag.name, newTagName.trim());
    
    toast({
      title: 'Tag renommé',
      description: `"${selectedTag.name}" a été renommé en "${newTagName.trim()}".`,
    });

    setRenameDialogOpen(false);
    setSelectedTag(null);
    setNewTagName('');
  };

  const handleDelete = () => {
    if (!selectedTag) return;

    onTagDeleted?.(selectedTag.name);
    
    toast({
      title: 'Tag supprimé',
      description: `Le tag "${selectedTag.name}" a été supprimé de ${selectedTag.count} note(s).`,
    });

    setDeleteDialogOpen(false);
    setSelectedTag(null);
  };

  const formatLastUsed = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  const totalTags = tagStats.length;
  const totalUsages = tagStats.reduce((sum, tag) => sum + tag.count, 0);
  const averageUsage = totalTags > 0 ? Math.round(totalUsages / totalTags) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              Gestion des tags
            </CardTitle>
            <CardDescription>
              {totalTags} tags • {totalUsages} utilisations • {averageUsage} en moyenne
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche */}
        <div className="space-y-2">
          <Label htmlFor="search-tags">Rechercher un tag</Label>
          <Input
            id="search-tags"
            placeholder="Filtrer les tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Liste des tags */}
        {filteredTags.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              {searchQuery ? 'Aucun tag trouvé' : 'Aucun tag utilisé'}
            </p>
            {!searchQuery && (
              <p className="text-sm text-muted-foreground">
                Commencez à ajouter des tags à vos notes
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredTags.map(tag => (
              <div
                key={tag.name}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="font-medium">
                      {tag.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {tag.count} note{tag.count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dernière utilisation: {formatLastUsed(tag.lastUsed)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRenameClick(tag)}
                    aria-label={`Renommer ${tag.name}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(tag)}
                    aria-label={`Supprimer ${tag.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Top tags */}
        {tagStats.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tags les plus utilisés
            </h4>
            <div className="flex flex-wrap gap-2">
              {tagStats.slice(0, 5).map(tag => (
                <Badge key={tag.name} variant="default" className="gap-2">
                  {tag.name}
                  <span className="text-xs opacity-70">×{tag.count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Dialog de renommage */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le tag</DialogTitle>
            <DialogDescription>
              Le tag sera mis à jour dans toutes les notes qui l'utilisent
              ({selectedTag?.count} note{selectedTag && selectedTag.count > 1 ? 's' : ''}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-tag-name">Nouveau nom</Label>
              <Input
                id="new-tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Entrez le nouveau nom"
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleRename} disabled={!newTagName.trim()}>
              Renommer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le tag</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le tag "{selectedTag?.name}" ?
              Il sera retiré de {selectedTag?.count} note{selectedTag && selectedTag.count > 1 ? 's' : ''}.
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
