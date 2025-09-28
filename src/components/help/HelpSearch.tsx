import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useHelp } from '@/hooks/useHelp';
import { useNavigate } from 'react-router-dom';

interface HelpSearchProps {
  onQuery?: (query: string) => void;
  placeholder?: string;
}

export const HelpSearch: React.FC<HelpSearchProps> = ({ 
  onQuery, 
  placeholder = "Rechercher un article…" 
}) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchResults, search, loading } = useHelp();
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 2) {
        search(query);
        setShowResults(true);
        if (onQuery) {
          onQuery(query);
        }
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search, onQuery]);

  const handleResultClick = (slug: string) => {
    navigate(`/help/article/${slug}`);
    setShowResults(false);
    setQuery('');
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <label htmlFor="help-search" className="sr-only">
          Rechercher dans l'aide
        </label>
        
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <Input
          id="help-search"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          aria-controls={showResults ? "search-results" : undefined}
          aria-expanded={showResults}
          role="combobox"
        />
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div 
          id="search-results"
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          {loading && (
            <div className="p-4 text-center">
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Recherche en cours...</p>
            </div>
          )}

          {!loading && searchResults.length === 0 && query.trim().length > 2 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun résultat pour "{query}"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Essayez des mots-clés différents
              </p>
            </div>
          )}

          {!loading && searchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result.slug)}
              className="w-full p-3 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none border-b last:border-b-0"
              role="option"
            >
              <h4 className="font-medium text-sm mb-1">{result.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {result.excerpt}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};