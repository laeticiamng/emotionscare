import React from 'react';
import { RefreshCw, Plus, Trash2, Edit } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmptyState from '@/components/common/EmptyState';
import { useConfirmDialog } from '@/components/common/ConfirmDialog';
import { useNotifications } from '@/components/ui/notification-system';
import { useApiList } from '@/hooks/useApi';
import ApiClient, { ApiResponse } from '@/services/api-client';

// Type exemple pour les données
interface ExampleItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

/**
 * Exemple d'usage des APIs avec gestion d'état complète
 * Démontre les patterns recommandés pour les listes de données
 */
const ApiExample: React.FC = () => {
  const { success, error: showError } = useNotifications();
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // Simulation d'API pour l'exemple
  const mockApiCall = async (page: number): Promise<ApiResponse<ExampleItem[]>> => {
    // Simulation de délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulation d'erreur parfois
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: {
          message: 'Network error',
          userMessage: 'Impossible de charger les données. Vérifiez votre connexion.'
        }
      };
    }

    // Données simulées
    const items: ExampleItem[] = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${page}-${i}`,
      title: `Élément ${(page - 1) * 10 + i + 1}`,
      description: `Description de l'élément numéro ${(page - 1) * 10 + i + 1}`,
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as any,
      created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));

    return {
      success: true,
      data: page > 3 ? [] : items // Simulate end of data after page 3
    };
  };

  const {
    items,
    loading,
    error,
    hasMore,
    loadItems,
    refresh,
    removeItem,
    isEmpty
  } = useApiList<ExampleItem>();

  // Charger les données initiales
  React.useEffect(() => {
    loadItems(mockApiCall, { reset: true });
  }, []);

  const handleLoadMore = () => {
    loadItems(mockApiCall);
  };

  const handleRefresh = () => {
    refresh(mockApiCall);
  };

  const handleDelete = (item: ExampleItem) => {
    showConfirm({
      title: 'Supprimer l\'élément',
      description: `Êtes-vous sûr de vouloir supprimer "${item.title}" ? Cette action est irréversible.`,
      variant: 'destructive',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        // Simulation d'API delete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        removeItem(i => i.id === item.id);
        success('Élément supprimé', `"${item.title}" a été supprimé avec succès.`);
      }
    });
  };

  const handleEdit = (item: ExampleItem) => {
    success('Édition', `Édition de "${item.title}" (fonctionnalité à implémenter)`);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <PageLayout
      title="Exemple d'API"
      description="Démonstration de la gestion des données avec états de chargement et d'erreur"
      backUrl="/examples"
      loading={loading && isEmpty}
      error={error?.userMessage}
      actions={
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={loading}
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      }
      emptyState={
        isEmpty && !loading && !error ? (
          <EmptyState
            icon={Plus}
            title="Aucun élément"
            description="Aucun élément n'a été trouvé. Commencez par en créer un."
            actionLabel="Créer un élément"
            onAction={() => success('Création', 'Fonctionnalité de création à implémenter')}
          />
        ) : undefined
      }
    >
      <div className="space-y-4">
        {/* Liste des éléments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Card 
              key={item.id}
              className="hover:shadow-md transition-shadow"
              style={{
                animationDelay: `${index * 0.05}s`,
                animation: 'fadeInUp 0.3s ease-out forwards'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium">
                    {item.title}
                  </CardTitle>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </p>
                
                <div className="text-xs text-muted-foreground mb-4">
                  Créé le {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bouton charger plus */}
        {hasMore && !loading && (
          <div className="text-center pt-6">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                'Charger plus'
              )}
            </Button>
          </div>
        )}

        {/* Indicateur de fin */}
        {!hasMore && items.length > 0 && (
          <div className="text-center pt-6">
            <p className="text-sm text-muted-foreground">
              Tous les éléments ont été chargés ({items.length} au total)
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog />
    </PageLayout>
  );
};

// CSS pour l'animation (à ajouter dans le fichier CSS global)
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default ApiExample;