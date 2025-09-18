import React, { useMemo, useState } from 'react';
import PageRoot from '@/components/common/PageRoot';
import { useJournalFeed } from '@/hooks/useJournalFeed';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BookOpen,
  Hash,
  Loader2,
  Mic,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { sanitizeInput as sanitizePlain } from '@/lib/validation/dataValidator';

const parseTags = (value: string): string[] => {
  return value
    .split(/[\s,]+/)
    .map(part => part.replace(/^#+/, ''))
    .map(part => sanitizePlain(part).toLowerCase())
    .filter(Boolean);
};

const formatRelativeDate = (isoDate: string) => {
  try {
    return formatDistanceToNow(new Date(isoDate), { addSuffix: true, locale: fr });
  } catch (error) {
    return '';
  }
};

const B2CJournalPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    entries,
    tags,
    search,
    setSearch,
    tagFilter,
    setTagFilter,
    isLoading,
    isError,
    error,
    refetch,
    createEntry,
    isCreating,
    createVoiceEntry,
    isCreatingVoice,
  } = useJournalFeed();

  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [voiceUrl, setVoiceUrl] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceTags, setVoiceTags] = useState('');

  const canRecordVoice = useMemo(() => Boolean(user?.id), [user?.id]);

  const handleCreateText = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      toast({
        title: 'Contenu requis',
        description: 'Écrivez quelques lignes avant de publier votre note.',
        variant: 'warning',
      });
      return;
    }

    try {
      await createEntry({
        content: trimmed,
        tags: parseTags(tagInput),
      });
      setContent('');
      setTagInput('');
      toast({
        title: 'Note ajoutée',
        description: 'Votre réflexion a été enregistrée et sécurisée.',
        variant: 'success',
      });
    } catch (creationError) {
      const message = creationError instanceof Error ? creationError.message : 'Impossible de créer la note';
      toast({
        title: 'Enregistrement impossible',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleCreateVoice = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!voiceUrl.trim() || !voiceTranscript.trim()) {
      toast({
        title: 'Champs manquants',
        description: 'Fournissez un lien audio sécurisé et une transcription avant de sauvegarder.',
        variant: 'warning',
      });
      return;
    }

    try {
      await createVoiceEntry({
        audioUrl: voiceUrl.trim(),
        transcription: voiceTranscript.trim(),
        tags: parseTags(voiceTags),
      });
      setVoiceUrl('');
      setVoiceTranscript('');
      setVoiceTags('');
      toast({
        title: 'Note vocale archivée',
        description: 'La transcription et les métadonnées ont été sécurisées.',
        variant: 'success',
      });
    } catch (creationError) {
      const message = creationError instanceof Error ? creationError.message : 'Impossible de créer la note vocale';
      toast({
        title: 'Enregistrement vocal impossible',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const filteredTags = useMemo(() => tags.slice(0, 24), [tags]);
  const emptyState = !isLoading && !isError && entries.length === 0;

  return (
    <PageRoot>
      <div className="container mx-auto px-4 py-10">
        <header className="mb-10 space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <BookOpen className="h-8 w-8 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-3xl font-semibold">Journal émotionnel</h1>
              <p className="text-muted-foreground">
                Capturez vos ressentis, ajoutez des hashtags et retrouvez vos dix dernières réflexions sécurisées.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,360px),1fr]">
          <div className="space-y-6">
            <form onSubmit={handleCreateText} noValidate>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
                    Nouvelle note textuelle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    id="journal-entry"
                    data-testid="journal-textarea"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder="Décrivez votre journée, vos ressentis, vos intentions..."
                    minLength={1}
                    className="min-h-[160px]"
                    aria-describedby="journal-helper"
                  />
                  <p id="journal-helper" className="text-xs text-muted-foreground">
                    Votre note sera nettoyée automatiquement pour empêcher tout contenu non sécurisé.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="journal-tags">
                      Tags (optionnel)
                    </label>
                    <Input
                      id="journal-tags"
                      data-testid="journal-tag-input"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      placeholder="ex: gratitude, focus, #confiance"
                      autoComplete="off"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground" aria-live="polite">
                    {content.length} caractères
                  </span>
                  <Button type="submit" disabled={isCreating} data-testid="journal-submit">
                    {isCreating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Publier
                  </Button>
                </CardFooter>
              </Card>
            </form>

            <form onSubmit={handleCreateVoice} noValidate>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mic className="h-5 w-5 text-primary" aria-hidden="true" />
                    Note vocale transcrite
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Déposez un lien audio sécurisé accompagné d&apos;une transcription pour conserver vos moments importants.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="voice-url">
                      URL de l&apos;audio sécurisé
                    </label>
                    <Input
                      id="voice-url"
                      data-testid="journal-voice-url"
                      type="url"
                      value={voiceUrl}
                      onChange={(event) => setVoiceUrl(event.target.value)}
                      placeholder="https://cdn.emotionscare.com/audio/ma-session.wav"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="voice-transcript">
                      Transcription associée
                    </label>
                    <Textarea
                      id="voice-transcript"
                      data-testid="journal-voice-transcript"
                      value={voiceTranscript}
                      onChange={(event) => setVoiceTranscript(event.target.value)}
                      placeholder="Transcrivez les points clés pour faciliter la recherche."
                      minLength={1}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="voice-tags">
                      Tags (optionnel)
                    </label>
                    <Input
                      id="voice-tags"
                      data-testid="journal-voice-tags"
                      value={voiceTags}
                      onChange={(event) => setVoiceTags(event.target.value)}
                      placeholder="ex: respiration, #soiree"
                      autoComplete="off"
                    />
                  </div>
                  {!canRecordVoice ? (
                    <p className="text-xs text-muted-foreground" role="status">
                      Connectez-vous pour archiver des notes vocales.
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={!canRecordVoice || isCreatingVoice}
                    data-testid="journal-voice-submit"
                  >
                    {isCreatingVoice ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : null}
                    Archiver
                  </Button>
                </CardFooter>
              </Card>
            </form>

            <Card role="note" aria-live="polite">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Protection des données
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <p>Chaque entrée est nettoyée (anti-XSS) et balisée avant d&apos;être envoyée.</p>
                <p>Les hashtags accélèrent la recherche et n&apos;acceptent que des caractères alphanumériques.</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-lg font-semibold">Historique récent</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  data-testid="journal-refresh"
                >
                  <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Actualiser
                </Button>
              </div>
              <div className="flex flex-col gap-3" role="search">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    data-testid="journal-search-input"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher par mot-clé ou hashtag"
                    className="pl-9"
                    aria-label="Recherche dans le journal"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={tagFilter ? 'outline' : 'default'}
                    onClick={() => setTagFilter(null)}
                    data-testid="journal-tag-all"
                  >
                    Tout
                  </Button>
                  {filteredTags.map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      size="sm"
                      variant={tagFilter === tag ? 'default' : 'outline'}
                      onClick={() => setTagFilter(tag)}
                      className="flex items-center gap-1"
                      data-testid={`journal-tag-${tag}`}
                      aria-pressed={tagFilter === tag}
                    >
                      <Hash className="h-3 w-3" aria-hidden="true" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4" aria-live="polite">
              {isLoading ? (
                <div className="space-y-3" data-testid="journal-loading">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse space-y-2 rounded-lg border p-4">
                      <div className="h-4 w-32 rounded bg-muted" />
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-3/4 rounded bg-muted" />
                    </div>
                  ))}
                </div>
              ) : null}

              {isError ? (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm" role="alert">
                  <p className="font-medium text-destructive-foreground">Impossible de charger le journal.</p>
                  <p className="text-destructive-foreground/80">
                    {error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'}
                  </p>
                </div>
              ) : null}

              {emptyState ? (
                <div className="rounded-lg border border-dashed p-6 text-center" data-testid="journal-empty">
                  <p className="text-sm text-muted-foreground">
                    Aucune entrée pour le moment. Commencez par écrire une réflexion ou ajoutez une note vocale.
                  </p>
                </div>
              ) : null}

              {!isLoading && !isError
                ? entries.map((entry) => {
                    const displayText = entry.summary || entry.text;
                    return (
                      <article
                        key={entry.id}
                        data-testid="journal-feed-entry"
                        className="rounded-lg border bg-card p-4 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge variant="outline" className="text-xs uppercase">
                            {entry.type === 'voice' ? 'Vocal' : 'Texte'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeDate(entry.timestamp)}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-foreground whitespace-pre-line">{displayText}</p>
                        {entry.tags.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2" aria-label="Tags de l'entrée">
                            {entry.tags.map((tag) => (
                              <Badge key={`${entry.id}-${tag}`} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    );
                  })
                : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageRoot>
  );
};

export default B2CJournalPage;
