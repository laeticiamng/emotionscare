import React, { useState } from 'react';
import { logger } from '@/lib/logger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Calendar, Tag, Smile, X } from 'lucide-react';
import { CommunityService, Post } from '@/modules/community/communityService';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { value: 'all', label: 'Toutes' },
  { value: 'success', label: '🎉 Succès' },
  { value: 'support', label: '🤝 Soutien' },
  { value: 'question', label: '❓ Question' },
  { value: 'inspiration', label: '✨ Inspiration' },
];

const moods = [
  { value: 'all', label: 'Toutes' },
  { value: 'happy', label: '😊 Heureux' },
  { value: 'calm', label: '😌 Calme' },
  { value: 'anxious', label: '😰 Anxieux' },
  { value: 'sad', label: '😢 Triste' },
  { value: 'energetic', label: '⚡ Énergique' },
  { value: 'neutral', label: '😐 Neutre' },
];

export function CommunitySearch() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [mood, setMood] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const posts = await CommunityService.searchPosts(searchQuery, {
        category: category !== 'all' ? category : undefined,
        mood: mood !== 'all' ? mood : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });

      setResults(posts);
    } catch (error) {
      logger.error('Search error:', error, 'COMPONENT');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategory('all');
    setMood('all');
    setSelectedTags([]);
    setDateFrom('');
    setDateTo('');
    setResults([]);
    setSearched(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Recherche avancée</DialogTitle>
          <DialogDescription>
            Recherchez des posts par contenu, catégorie, humeur, tags et date
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="Mots-clés à rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>
                <Tag className="h-4 w-4 inline mr-2" />
                Catégorie
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mood */}
            <div className="space-y-2">
              <Label>
                <Smile className="h-4 w-4 inline mr-2" />
                Humeur
              </Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moods.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date de début
              </Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="dateTo">
                <Calendar className="h-4 w-4 inline mr-2" />
                Date de fin
              </Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {selectedTags.length < 5 && (
              <Input
                placeholder="Ajouter un tag (Entrée pour ajouter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    addTag(input.value.trim());
                    input.value = '';
                  }
                }}
              />
            )}
          </div>

          {/* Reset Button */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleReset}>
              <X className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>

          <Separator />

          {/* Results */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">
              Résultats
              {searched && (
                <span className="ml-2 text-sm text-muted-foreground">
                  ({results.length} post{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''})
                </span>
              )}
            </Label>

            <ScrollArea className="h-[300px]">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Recherche en cours...
                </div>
              ) : searched && results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun résultat trouvé
                </div>
              ) : !searched ? (
                <div className="text-center py-8 text-muted-foreground">
                  Lancez une recherche pour voir les résultats
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((post) => (
                    <Card key={post.id} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <p className="text-sm line-clamp-3">{post.content}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {post.category && (
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                              )}
                              {post.mood && (
                                <Badge variant="outline" className="text-xs">
                                  {moods.find(m => m.value === post.mood)?.label || post.mood}
                                </Badge>
                              )}
                              <span>•</span>
                              <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
