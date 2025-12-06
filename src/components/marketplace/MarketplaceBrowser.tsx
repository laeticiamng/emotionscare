/**
 * Marketplace Browser - Navigation et recherche
 */

import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useMarketplaceSearch, useMarketplaceCategories } from '@/hooks/useMarketplace';
import { MarketplaceItemCard } from './MarketplaceItemCard';
import { MarketplaceItem, SearchFilters, MarketplaceItemType } from '@/services/marketplaceService';
import { cn } from '@/lib/utils';

interface MarketplaceBrowserProps {
  onSelectItem?: (item: MarketplaceItem) => void;
  onInstall?: (item: MarketplaceItem) => void;
  installedItemIds?: string[];
}

export function MarketplaceBrowser({
  onSelectItem,
  onInstall,
  installedItemIds = [],
}: MarketplaceBrowserProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'newest',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { items, total, loading, error, page, search, nextPage, prevPage } =
    useMarketplaceSearch(filters, { autoFetch: true });

  const { categories } = useMarketplaceCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
    search({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
    search({ ...filters, ...newFilters, page: 1 });
  };

  const itemsPerPage = 20;
  const totalPages = Math.ceil(total / itemsPerPage);

  const typeOptions: { value: MarketplaceItemType; label: string; emoji: string }[] = [
    { value: 'theme', label: 'Thèmes', emoji: '🎨' },
    { value: 'widget', label: 'Widgets', emoji: '📦' },
    { value: 'sound_pack', label: 'Packs Sonores', emoji: '🎵' },
    { value: 'ritual', label: 'Rituels', emoji: '🕯️' },
    { value: 'meditation', label: 'Méditations', emoji: '🧘' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Plus récent' },
    { value: 'popular', label: 'Plus populaire' },
    { value: 'rating', label: 'Mieux noté' },
    { value: 'trending', label: 'Tendance' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
  ];

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Chercher un thème, widget, pack sonore..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Chercher
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFilters(!showFilters);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Filtres (affichés au clic) */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <div className="space-y-2">
                  {typeOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="type"
                        value={option.value}
                        checked={filters.type === option.value}
                        onChange={() =>
                          handleFilterChange({
                            type: option.value,
                          })
                        }
                        className="rounded"
                      />
                      <span className="text-sm">{option.emoji} {option.label}</span>
                    </label>
                  ))}
                  {filters.type && (
                    <button
                      type="button"
                      onClick={() => handleFilterChange({ type: undefined })}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>

              {/* Catégorie */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={filters.categoryId || ''}
                    onChange={(e) =>
                      handleFilterChange({
                        categoryId: e.target.value || undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tri */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={filters.sortBy || 'newest'}
                  onChange={(e) =>
                    handleFilterChange({
                      sortBy: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.onlyFree === true}
                      onChange={() =>
                        handleFilterChange({ onlyFree: true, onlyPremium: false })
                      }
                    />
                    <span className="text-sm">Gratuit uniquement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={filters.onlyPremium === true}
                      onChange={() =>
                        handleFilterChange({ onlyFree: false, onlyPremium: true })
                      }
                    />
                    <span className="text-sm">Premium uniquement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="price"
                      checked={!filters.onlyFree && !filters.onlyPremium}
                      onChange={() =>
                        handleFilterChange({ onlyFree: false, onlyPremium: false })
                      }
                    />
                    <span className="text-sm">Tous</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Note minimale
                </label>
                <select
                  value={filters.minRating || 0}
                  onChange={(e) =>
                    handleFilterChange({
                      minRating: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="0">Toutes les notes</option>
                  <option value="3">3+ ⭐</option>
                  <option value="4">4+ ⭐</option>
                  <option value="5">5 ⭐</option>
                </select>
              </div>

              {/* Official items */}
              <div>
                <label className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={filters.onlyOfficial || false}
                    onChange={(e) =>
                      handleFilterChange({
                        onlyOfficial: e.target.checked || undefined,
                      })
                    }
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Items officiels uniquement
                  </span>
                </label>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={() => {
                  setFilters({ sortBy: 'newest' });
                  setSearchTerm('');
                  search({ sortBy: 'newest' });
                }}
                className="mt-6 flex items-center gap-2 text-indigo-600 hover:underline font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Résultats */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Erreur lors du chargement: {error}
        </div>
      )}

      {loading && !items.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          {/* Info résultats */}
          <div className="text-sm text-gray-600">
            Affichage de {(page - 1) * itemsPerPage + 1} à{' '}
            {Math.min(page * itemsPerPage, total)} sur {total} résultats
          </div>

          {/* Grille d'items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <MarketplaceItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                onInstall={onInstall}
                isInstalled={installedItemIds.includes(item.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => {
                      // Note: would need to implement goToPage in the hook
                    }}
                    className={cn(
                      'px-3 py-2 rounded-lg font-semibold',
                      page === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={nextPage}
                disabled={page >= totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Aucun résultat trouvé</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ sortBy: 'newest' });
              search({ sortBy: 'newest' });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Afficher tous les items
          </button>
        </div>
      )}
    </div>
  );
}
