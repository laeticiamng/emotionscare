'use client';

import { useCallback, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FocusTrap, useReducedMotion } from '@/components/ui/AccessibilityOptimized';

const REPLIES = [
  {
    id: 'listen_here',
    title: 'Présence discrète',
    suggestion: 'Je suis là si tu veux en parler.',
    description: 'Un message doux pour signaler une oreille attentive.',
  },
  {
    id: 'two_minutes',
    title: 'Pause silencieuse',
    suggestion: 'On prend deux minutes en silence si tu veux.',
    description: 'Invitation à respirer ensemble sans obligation.',
  },
  {
    id: 'validating',
    title: 'Validation rassurante',
    suggestion: 'Ce que tu ressens compte et peut être partagé ici.',
    description: 'Pour rappeler que chaque émotion est légitime.',
  },
] as const;

const sanitize = (value: string) =>
  value
    .replace(/<[^>]+>/g, '')
    .replace(/\r?\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .trim();

type PreviewState = {
  id: string;
  text: string;
};

const dialogMotionClass = 'data-[state=open]:animate-in data-[state=closed]:animate-out';

export default function EmpathicRepliesPanel(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const openPreview = useCallback((templateId: string) => {
    const template = REPLIES.find((entry) => entry.id === templateId);
    if (!template) return;

    setPreview({ id: template.id, text: template.suggestion });
    setCopySuccess(null);
    Sentry.addBreadcrumb({
      category: 'social',
      level: 'info',
      message: 'social:replies_preview_open',
      data: { template: templateId },
    });
  }, []);

  const closePreview = useCallback(() => {
    setPreview(null);
    setCopySuccess(null);
  }, []);

  const handleChange = useCallback((value: string) => {
    setPreview((current) => (current ? { ...current, text: sanitize(value) } : current));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!preview) return;
    try {
      await navigator.clipboard?.writeText(preview.text);
      setCopySuccess('Texte copié, tu peux l’envoyer à ton rythme.');
      toast({
        title: 'Texte prêt',
        description: 'Le message est dans le presse-papiers. Tu peux encore l’adapter.',
        variant: 'success',
      });
      Sentry.addBreadcrumb({
        category: 'social',
        level: 'info',
        message: 'social:reply_copied',
        data: { template: preview.id },
      });
    } catch (error) {
      console.warn('[EmpathicRepliesPanel] copy failed', error);
      toast({
        title: 'Copie impossible',
        description: 'Tu peux sélectionner le texte et le copier manuellement.',
        variant: 'warning',
      });
      Sentry.captureException(error, {
        tags: { scope: 'community', action: 'copy_reply' },
      });
    }
  }, [preview, toast]);

  const dialogClasses = useMemo(() => (
    prefersReducedMotion ? dialogMotionClass.replace(/data-\[state=.*?\]:animate-[^\s]+/g, 'transition-none') : dialogMotionClass
  ), [prefersReducedMotion]);

  return (
    <section
      aria-labelledby="community-empathic-replies"
      aria-live="polite"
      className="space-y-6 rounded-xl border border-emerald-100/70 bg-emerald-50/70 p-6 text-emerald-950 shadow-sm"
    >
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-emerald-600">Soutien prêt à envoyer</p>
        <h2 id="community-empathic-replies" className="text-2xl font-semibold">Propositions empathiques</h2>
        <p className="max-w-2xl text-sm text-emerald-700">
          Ces phrases sont des points de départ. Tu peux les personnaliser avant de les partager, elles n’impliquent aucun envoi automatique.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {REPLIES.map((entry) => (
          <Card key={entry.id} className="border-transparent bg-white/80 shadow-none transition-colors hover:bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-emerald-900">{entry.title}</CardTitle>
              <CardDescription className="text-sm text-emerald-700">{entry.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="rounded-md bg-emerald-100/80 p-3 text-sm text-emerald-900">{entry.suggestion}</p>
              <Button
                type="button"
                variant="secondary"
                className="w-full bg-emerald-900 text-emerald-50 hover:bg-emerald-800"
                onClick={() => openPreview(entry.id)}
              >
                Prévisualiser & envoyer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(preview)} onOpenChange={(open) => (open ? undefined : closePreview())}>
        {preview && (
          <DialogContent className={`${dialogClasses} bg-white text-emerald-950`}>
            <FocusTrap active>
              <DialogHeader>
                <DialogTitle>Prévisualisation douce</DialogTitle>
                <DialogDescription>
                  Ajuste librement le message avant de le partager. Aucun envoi automatique n’est déclenché.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={preview.text}
                onChange={(event) => handleChange(event.target.value)}
                aria-label="Texte empathique à personnaliser"
                className="min-h-[8rem] resize-none border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200"
              />
              {copySuccess && (
                <p className="text-sm text-emerald-700" role="status" aria-live="polite">
                  {copySuccess}
                </p>
              )}
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  onClick={handleCopy}
                  className="bg-emerald-900 text-emerald-50 hover:bg-emerald-800"
                >
                  Copier pour l’envoyer
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost" className="text-emerald-700 hover:bg-emerald-100">
                    Fermer
                  </Button>
                </DialogClose>
              </DialogFooter>
            </FocusTrap>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
