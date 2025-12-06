// @ts-nocheck
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { JournalEntry } from '@/store/journal.store';
import { EntryCard } from './EntryCard';

interface EntriesListProps {
  items: JournalEntry[];
  loading?: boolean;
}

export const EntriesList: React.FC<EntriesListProps> = ({ items, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(entry => 
      entry.summary?.toLowerCase().includes(query) ||
      entry.suggestion?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher dans vos notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEntries.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery ? (
            <div>
              <div className="text-lg mb-2">Aucun résultat trouvé</div>
              <div className="text-sm">Essayez des mots-clés différents</div>
            </div>
          ) : (
            <div>
              <div className="text-lg mb-2">Votre journal est vide</div>
              <div className="text-sm">Commencez par enregistrer votre première note ✨</div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <EntryCard key={entry.entry_id} entry={entry} />
        ))}
      </div>
    </div>
  );
};