/**
 * EmptyModuleState - État vide pour les listes de modules
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyModuleStateProps {
  searchQuery?: string;
  hasFilters?: boolean;
  onResetFilters?: () => void;
  onSuggest?: () => void;
}

const EmptyModuleState: React.FC<EmptyModuleStateProps> = ({
  searchQuery,
  hasFilters = false,
  onResetFilters,
  onSuggest
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        {searchQuery ? (
          <Search className="h-8 w-8 text-muted-foreground" />
        ) : hasFilters ? (
          <Filter className="h-8 w-8 text-muted-foreground" />
        ) : (
          <Sparkles className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-2">
        {searchQuery
          ? `Aucun résultat pour "${searchQuery}"`
          : hasFilters
          ? 'Aucun module ne correspond à vos filtres'
          : 'Aucun module disponible'}
      </h3>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchQuery
          ? 'Essayez avec des termes différents ou vérifiez l\'orthographe.'
          : hasFilters
          ? 'Essayez de modifier vos critères de recherche.'
          : 'Les modules seront bientôt disponibles.'}
      </p>
      
      <div className="flex gap-3">
        {(searchQuery || hasFilters) && onResetFilters && (
          <Button variant="outline" onClick={onResetFilters}>
            Réinitialiser les filtres
          </Button>
        )}
        {onSuggest && (
          <Button onClick={onSuggest} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Suggestions IA
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyModuleState;
