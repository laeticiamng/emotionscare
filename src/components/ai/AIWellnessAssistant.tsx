/**
 * AIWellnessAssistant - Composant révolutionnaire intégrant les 3 APIs premium
 * Combine ElevenLabs (TTS), Perplexity (AI Search) et Firecrawl (Web Scraping)
 * pour une expérience de coaching émotionnel unique au monde
 */

import React, { useState, useCallback, memo } from 'react';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Search, 
  Globe, 
  Sparkles, 
  Brain,
  Heart,
  Loader2,
  ExternalLink,
  BookOpen,
  MessageCircle
} from 'lucide-react';
import { useElevenLabs } from '@/hooks/useElevenLabs';
import { usePerplexity, useEmotionSearch } from '@/hooks/usePerplexity';
import { useFirecrawl } from '@/hooks/useFirecrawl';
import { cn } from '@/lib/utils';

interface AIWellnessAssistantProps {
  className?: string;
  defaultEmotion?: string;
  compact?: boolean;
}

const AIWellnessAssistant: React.FC<AIWellnessAssistantProps> = memo(({
  className,
  defaultEmotion = '',
  compact = false,
}) => {
  const [query, setQuery] = useState('');
  const [emotion, setEmotion] = useState(defaultEmotion);
  const [activeTab, setActiveTab] = useState<'search' | 'emotion' | 'resources'>('search');

  // Hooks premium
  const { 
    speak, 
    speakWithMood, 
    isPlaying, 
    isLoading: ttsLoading, 
    stop 
  } = useElevenLabs({ autoPlay: true });

  const { 
    search, 
    result: searchResult, 
    isLoading: searchLoading,
    searchEmotion,
    searchWellness
  } = usePerplexity({ context: 'wellness' });

  const { 
    data: emotionData, 
    isLoading: emotionLoading 
  } = useEmotionSearch(emotion, emotion.length > 2);

  const { 
    searchWellness: searchResources, 
    searchResult: resourcesResult, 
    isLoading: resourcesLoading 
  } = useFirecrawl();

  // Recherche avec lecture vocale
  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    search(query);
  }, [query, search]);

  // Lire la réponse à haute voix
  const handleSpeak = useCallback(() => {
    if (searchResult?.answer) {
      speakWithMood(searchResult.answer, 'calm');
    }
  }, [searchResult, speakWithMood]);

  // Rechercher des ressources web
  const handleResourceSearch = useCallback(() => {
    if (!query.trim()) return;
    searchResources(query);
  }, [query, searchResources]);

  const isLoading = searchLoading || ttsLoading || emotionLoading || resourcesLoading;

  if (compact) {
    return (
      <Card className={cn("bg-gradient-to-br from-background to-muted/30", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Posez une question bien-être..."
                className="pl-10"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              size="sm"
            >
              {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>
          
          {searchResult?.answer && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
              <p className="line-clamp-3">{searchResult.answer}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSpeak}
                className="mt-2"
              >
                {isPlaying ? <VolumeX className="h-4 w-4 mr-1" /> : <Volume2 className="h-4 w-4 mr-1" />}
                {isPlaying ? 'Arrêter' : 'Écouter'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "bg-gradient-to-br from-background via-background to-primary/5 border-primary/20",
      className
    )}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            Assistant IA Bien-être
          </CardTitle>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Perplexity
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Mic className="h-3 w-3 mr-1" />
              ElevenLabs
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Firecrawl
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Barre de recherche principale */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Comment gérer mon stress ? Qu'est-ce que la pleine conscience ?"
              className="pl-10 h-12"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isLoading}
            className="h-12 px-6"
          >
            {searchLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>

        {/* Onglets de fonctionnalités */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Réponse IA
            </TabsTrigger>
            <TabsTrigger value="emotion" className="gap-2">
              <Heart className="h-4 w-4" />
              Émotions
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Ressources
            </TabsTrigger>
          </TabsList>

          {/* Onglet Réponse IA */}
          <TabsContent value="search" className="mt-4">
            {searchResult?.answer ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Réponse de l'IA</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isPlaying ? stop : handleSpeak}
                      disabled={ttsLoading}
                    >
                      {ttsLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPlaying ? (
                        <>
                          <VolumeX className="h-4 w-4 mr-1" />
                          Arrêter
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 mr-1" />
                          Écouter
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <ScrollArea className="h-[300px] rounded-lg border p-4 bg-muted/30">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize((searchResult.answer || '')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n/g, '<br/>')
                        .replace(/^/, '<p>')
                        .replace(/$/, '</p>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/### (.*?)(<br\/>|<\/p>)/g, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
                        .replace(/## (.*?)(<br\/>|<\/p>)/g, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>'))
                    }}
                  />
                </ScrollArea>

                {/* Citations */}
                {searchResult.citations?.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">Sources ({searchResult.citations.length})</h5>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.citations.slice(0, 5).map((citation, index) => {
                        const url = typeof citation === 'string' ? citation : citation.url;
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Source {index + 1}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Posez une question pour obtenir une réponse IA personnalisée</p>
                <p className="text-sm mt-2">Avec lecture vocale ultra-réaliste</p>
              </div>
            )}
          </TabsContent>

          {/* Onglet Émotions */}
          <TabsContent value="emotion" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="Entrez une émotion (ex: anxiété, joie, colère)"
                  className="flex-1"
                />
                <Button 
                  onClick={() => searchEmotion(emotion)}
                  disabled={!emotion || emotionLoading}
                  variant="outline"
                >
                  {emotionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
                </Button>
              </div>

              {/* Émotions rapides */}
              <div className="flex flex-wrap gap-2">
                {['Anxiété', 'Stress', 'Tristesse', 'Colère', 'Joie', 'Sérénité'].map((e) => (
                  <Button
                    key={e}
                    variant={emotion === e.toLowerCase() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEmotion(e.toLowerCase())}
                  >
                    {e}
                  </Button>
                ))}
              </div>

              {emotionData?.answer && (
                <ScrollArea className="h-[250px] rounded-lg border p-4 bg-muted/30">
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize((emotionData.answer || '')
                        .replace(/\n\n/g, '</p><p>')
                        .replace(/\n/g, '<br/>')
                        .replace(/^/, '<p>')
                        .replace(/$/, '</p>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'))
                    }}
                  />
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          {/* Onglet Ressources */}
          <TabsContent value="resources" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher des ressources bien-être..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleResourceSearch}
                  disabled={resourcesLoading}
                  variant="outline"
                >
                  {resourcesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                </Button>
              </div>

              {resourcesResult?.data && resourcesResult.data.length > 0 ? (
                <div className="space-y-3">
                  {resourcesResult.data.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {resource.metadata?.title || 'Ressource'}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {resource.metadata?.description || resource.markdown?.slice(0, 150)}
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recherchez des ressources bien-être sur le web</p>
                  <p className="text-sm mt-2">Extraction intelligente de contenus validés</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

AIWellnessAssistant.displayName = 'AIWellnessAssistant';

export default AIWellnessAssistant;
