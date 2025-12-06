/**
 * Installed Items Manager - Gestion des thèmes/widgets installés
 */

import React, { useState } from 'react';
import { Trash2, Eye, EyeOff, Download } from 'lucide-react';
import { useInstalledThemes } from '@/hooks/useMarketplace';
import { InstalledTheme, MarketplaceItem } from '@/services/marketplaceService';
import { cn } from '@/lib/utils';

interface InstalledItemsManagerProps {
  userId: string | undefined;
}

export function InstalledItemsManager({ userId }: InstalledItemsManagerProps) {
  const { installed, items, activeTheme, loading, activateTheme } =
    useInstalledThemes(userId);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mx-auto" />
        <p className="text-gray-600 mt-2">Chargement...</p>
      </div>
    );
  }

  if (installed.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-3">📦</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun item installé
        </h3>
        <p className="text-gray-600 mb-4">
          Installez des thèmes et widgets depuis le marketplace pour les gérer ici.
        </p>
      </div>
    );
  }

  const itemsMap = items.reduce(
    (acc, item: MarketplaceItem) => {
      acc[item.id] = item;
      return acc;
    },
    {} as Record<string, MarketplaceItem>
  );

  return (
    <div className="space-y-6">
      {/* Thème actif */}
      {activeTheme && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Thème actif</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{activeTheme.item.name}</p>
              <p className="text-indigo-100 text-sm">
                Activé depuis {new Date(activeTheme.installed.activated_at!).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <Eye className="w-6 h-6 opacity-80" />
          </div>
        </div>
      )}

      {/* Liste des items installés */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            Items installés ({installed.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {installed.map((installedItem) => {
            const item = itemsMap[installedItem.item_id];
            if (!item) return null;

            const isActive = activeTheme?.installed.id === installedItem.id;

            return (
              <div
                key={installedItem.id}
                className={cn(
                  'p-4 hover:bg-gray-50 transition-colors',
                  isActive && 'bg-indigo-50 border-l-4 border-indigo-600'
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        🎨
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {isActive && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                          Actif
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="text-xs text-gray-500">
                      Version {item.version} •{' '}
                      {new Date(installedItem.installed_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Bouton d'aperçu */}
                    <button
                      onClick={() =>
                        setSelectedPreview(
                          selectedPreview === item.id ? null : item.id
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Aperçu"
                    >
                      {selectedPreview === item.id ? (
                        <EyeOff className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-600" />
                      )}
                    </button>

                    {/* Bouton d'activation */}
                    {!isActive && (
                      <button
                        onClick={() => activateTheme(installedItem.id)}
                        className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Activer
                      </button>
                    )}

                    {/* Bouton de suppression */}
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Aperçu (si sélectionné) */}
                {selectedPreview === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {item.preview_images && item.preview_images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {item.preview_images.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">Aucun aperçu disponible</p>
                      </div>
                    )}

                    {/* Couleurs personnalisées */}
                    {installedItem.custom_colors &&
                      Object.keys(installedItem.custom_colors).length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Couleurs personnalisées
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {Object.entries(installedItem.custom_colors).map(
                              ([name, color]) => (
                                <div key={name} className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded border border-gray-300"
                                    style={{ backgroundColor: color as string }}
                                  />
                                  <span className="text-xs text-gray-600">{name}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">Total installé</p>
          <p className="text-2xl font-bold text-blue-900">{installed.length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Thème actif</p>
          <p className="text-lg font-bold text-green-900">
            {activeTheme ? activeTheme.item.name : 'Aucun'}
          </p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Espace utilisé</p>
          <p className="text-xl font-bold text-purple-900">
            ~{(items.reduce((sum, item) => sum + (item.file_size || 0), 0) / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
      </div>
    </div>
  );
}
