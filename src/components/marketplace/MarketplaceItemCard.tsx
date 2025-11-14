/**
 * Marketplace Item Card - Affichage d'un item
 */

import React from 'react';
import { Star, Download, Lock, Badge } from 'lucide-react';
import { MarketplaceItem } from '@/services/marketplaceService';
import { cn } from '@/lib/utils';

interface MarketplaceItemCardProps {
  item: MarketplaceItem;
  onSelect?: (item: MarketplaceItem) => void;
  onInstall?: (item: MarketplaceItem) => void;
  isInstalled?: boolean;
  className?: string;
}

export function MarketplaceItemCard({
  item,
  onSelect,
  onInstall,
  isInstalled = false,
  className,
}: MarketplaceItemCardProps) {
  const typeEmoji: Record<string, string> = {
    theme: '🎨',
    widget: '📦',
    sound_pack: '🎵',
    ritual: '🕯️',
    meditation: '🧘',
  };

  const typeLabel: Record<string, string> = {
    theme: 'Thème',
    widget: 'Widget',
    sound_pack: 'Pack Sonore',
    ritual: 'Rituel',
    meditation: 'Méditation',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer',
        className
      )}
      onClick={() => onSelect?.(item)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {typeEmoji[item.type]}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          {item.is_official && (
            <div className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Badge className="w-3 h-3" />
              Officiel
            </div>
          )}
          {item.is_featured && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ⭐ À la une
            </div>
          )}
          {isInstalled && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              ✓ Installé
            </div>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-semibold">
          {typeLabel[item.type]}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Nom */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {item.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {item.description}
        </p>

        {/* Ratings et stats */}
        <div className="flex items-center gap-2 mb-3">
          {item.average_rating > 0 ? (
            <>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < Math.round(item.average_rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {item.average_rating.toFixed(1)} ({item.rating_count})
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Pas encore d'avis</span>
          )}
        </div>

        {/* Downloads */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Download className="w-4 h-4" />
          <span>{item.install_count} installations</span>
        </div>

        {/* Prix et actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            {item.price > 0 ? (
              <div className="flex items-center gap-1">
                {item.is_premium && (
                  <Lock className="w-4 h-4 text-orange-500" />
                )}
                <span className="font-bold text-gray-900">
                  {item.price.toFixed(2)}€
                </span>
              </div>
            ) : (
              <span className="font-semibold text-green-600">Gratuit</span>
            )}
          </div>

          {/* Bouton d'action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInstall?.(item);
            }}
            className={cn(
              'px-3 py-1 rounded text-sm font-semibold transition-colors',
              isInstalled
                ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                : item.is_premium
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
            )}
            disabled={isInstalled}
          >
            {isInstalled ? 'Installé' : item.price > 0 ? 'Acheter' : 'Installer'}
          </button>
        </div>
      </div>
    </div>
  );
}
