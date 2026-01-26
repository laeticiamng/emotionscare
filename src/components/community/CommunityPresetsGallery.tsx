/**
 * CommunityPresetsGallery - Galerie des presets communautaires
 * TOP 20 #3 - Composant UI pour useMoodMixerPresets
 */

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, Search, Filter, Star, User, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export interface CommunityPreset {
  id: string;
  creator_id: string;
  creator_name: string;
  name: string;
  description: string;
  preset_data: Record<string, unknown>;
  category: string;
  tags: string[];
  likes_count: number;
  downloads_count: number;
  is_featured: boolean;
  created_at: string;
}

interface CommunityPresetsGalleryProps {
  presets: CommunityPreset[];
  isLoading: boolean;
  onLike: (presetId: string) => Promise<void>;
  onDownload: (presetId: string) => Promise<void>;
  onApply: (preset: CommunityPreset) => void;
  userLikes: Set<string>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const PresetCard = memo(({ 
  preset, 
  isLiked,
  onLike,
  onDownload,
  onApply
}: { 
  preset: CommunityPreset;
  isLiked: boolean;
  onLike: () => void;
  onDownload: () => void;
  onApply: () => void;
}) => {
  const categoryColors: Record<string, string> = {
    mood: 'bg-purple-500/20 text-purple-500',
    energy: 'bg-yellow-500/20 text-yellow-500',
    focus: 'bg-blue-500/20 text-blue-500',
    relax: 'bg-green-500/20 text-green-500',
    creative: 'bg-pink-500/20 text-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "overflow-hidden hover:shadow-lg transition-shadow",
        preset.is_featured && "ring-2 ring-yellow-500"
      )}>
        {preset.is_featured && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs py-1 text-center font-medium">
            ⭐ Preset en vedette
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{preset.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{preset.creator_name}</span>
              </div>
            </div>
            <Badge className={categoryColors[preset.category] || 'bg-gray-500/20 text-gray-500'}>
              {preset.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {preset.description || 'Aucune description'}
          </p>

          {/* Tags */}
          {preset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {preset.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {preset.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{preset.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className={cn(
                "w-4 h-4",
                isLiked && "fill-red-500 text-red-500"
              )} />
              <span>{preset.likes_count}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              <span>{preset.downloads_count}</span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              <span className="text-xs">
                {new Date(preset.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-0">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={onLike}
          >
            <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
            {isLiked ? 'Aimé' : 'Aimer'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onDownload}
          >
            <Download className="w-4 h-4 mr-1" />
            Télécharger
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={onApply}
          >
            Appliquer
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
});

PresetCard.displayName = 'PresetCard';

export const CommunityPresetsGallery = memo(({
  presets,
  isLoading,
  onLike,
  onDownload,
  onApply,
  userLikes,
  searchQuery,
  onSearchChange
}: CommunityPresetsGalleryProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState<'likes' | 'downloads' | 'recent'>('likes');

  const filteredPresets = presets
    .filter(p => {
      if (activeTab === 'featured') return p.is_featured;
      if (activeTab !== 'all') return p.category === activeTab;
      return true;
    })
    .filter(p => 
      !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'likes') return b.likes_count - a.likes_count;
      if (sortBy === 'downloads') return b.downloads_count - a.downloads_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher des presets..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'likes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('likes')}
          >
            <Heart className="w-4 h-4 mr-1" />
            Populaires
          </Button>
          <Button
            variant={sortBy === 'downloads' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('downloads')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Téléchargés
          </Button>
          <Button
            variant={sortBy === 'recent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('recent')}
          >
            <Clock className="w-4 h-4 mr-1" />
            Récents
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="w-3 h-3 mr-1" />
            En vedette
          </TabsTrigger>
          <TabsTrigger value="mood">Humeur</TabsTrigger>
          <TabsTrigger value="energy">Énergie</TabsTrigger>
          <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="relax">Relaxation</TabsTrigger>
          <TabsTrigger value="creative">Créativité</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredPresets.length} preset{filteredPresets.length !== 1 ? 's' : ''} trouvé{filteredPresets.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : filteredPresets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Filter className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun preset trouvé</p>
            <Button 
              variant="link" 
              onClick={() => { setActiveTab('all'); onSearchChange(''); }}
            >
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredPresets.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isLiked={userLikes.has(preset.id)}
                onLike={() => onLike(preset.id)}
                onDownload={() => onDownload(preset.id)}
                onApply={() => onApply(preset)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

CommunityPresetsGallery.displayName = 'CommunityPresetsGallery';

export default CommunityPresetsGallery;
