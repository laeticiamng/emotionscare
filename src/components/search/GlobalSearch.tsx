
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useGlobalSearch, SearchResult, SearchResults as SearchResultsType, sectionLabels } from '@/hooks/useGlobalSearch';
import { Search, Loader, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchResultsList = ({ 
  data, 
  onSelect,
  highlightedIndex,
  setHighlightedIndex
}: { 
  data: SearchResultsType; 
  onSelect: (path: string) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
}) => {
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const flatResults = getFlatResults(data);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedIndex < flatResults.length) {
      resultRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex, flatResults.length]);

  if (Object.values(data).every(section => section.length === 0)) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Aucun résultat trouvé
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([sectionKey, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={sectionKey} className="space-y-1">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase px-2 py-1">
              {sectionLabels[sectionKey as keyof SearchResultsType]}
            </h3>
            <div className="space-y-1">
              {items.map((item, idx) => {
                const currentIndex = globalIndex;
                globalIndex++;
                
                return (
                  <button
                    ref={el => resultRefs.current[currentIndex] = el}
                    key={`${sectionKey}-${item.id || item.key || idx}`}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      highlightedIndex === currentIndex 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-accent'
                    }`}
                    onClick={() => onSelect(item.to)}
                    role="option"
                    aria-selected={highlightedIndex === currentIndex}
                    data-index={currentIndex}
                  >
                    <div className="flex items-center">
                      {item.icon && <div className="mr-2">{item.icon}</div>}
                      <span>{item.name || item.label || item.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper to get all results as a flat array
function getFlatResults(results: SearchResultsType): SearchResult[] {
  return Object.values(results).reduce<SearchResult[]>((acc, section) => {
    return [...acc, ...section];
  }, []);
}

const GlobalSearch: React.FC = () => {
  const { 
    isOpen, 
    setIsOpen, 
    query, 
    setQuery, 
    results, 
    isLoading, 
    handleSelect, 
    handleClose 
  } = useGlobalSearch();
  
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results) return;
    
    const flatResults = getFlatResults(results);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < flatResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : flatResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < flatResults.length) {
          handleSelect(flatResults[highlightedIndex].to);
        }
        break;
      default:
        break;
    }
  };
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  return (
    <>
      {/* Search trigger button in the UI */}
      <Button 
        variant="outline" 
        size="sm" 
        className="hidden md:flex items-center gap-2" 
        onClick={() => setIsOpen(true)}
      >
        <Search size={16} />
        <span>Rechercher...</span>
        <kbd className="ml-2 text-xs bg-muted px-2 py-0.5 rounded">⌘K</kbd>
      </Button>
      
      {/* Mobile search button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={() => setIsOpen(true)}
      >
        <Search size={20} />
        <span className="sr-only">Rechercher</span>
      </Button>
      
      {/* Search dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-xl w-full p-0 gap-0 overflow-hidden"
          onEscapeKeyDown={handleClose}
          onInteractOutside={handleClose}
        >
          <div className="flex items-center border-b p-4">
            <Search className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher... (Utilisateurs, Modules, KPIs, Notifications)"
              className="flex w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground text-base"
              onKeyDown={handleKeyDown}
              aria-label="Recherche globale"
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={!!results}
              aria-activedescendant={highlightedIndex >= 0 ? `result-${highlightedIndex}` : undefined}
            />
            {query && (
              <X 
                className="h-5 w-5 shrink-0 text-muted-foreground cursor-pointer"
                onClick={() => setQuery('')}
              />
            )}
          </div>
          <div 
            id="search-results"
            role="listbox"
            className="max-h-[60vh] overflow-y-auto p-4"
          >
            {isLoading ? (
              <div className="py-8 text-center">
                <Loader className="h-6 w-6 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Recherche en cours...</p>
              </div>
            ) : results ? (
              <SearchResultsList 
                data={results} 
                onSelect={handleSelect} 
                highlightedIndex={highlightedIndex}
                setHighlightedIndex={setHighlightedIndex}
              />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                Commencez à taper pour rechercher...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalSearch;
