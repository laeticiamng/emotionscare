// @ts-nocheck
import { useState } from 'react';
import { usePrivacyPolicyVersions } from '@/hooks/usePrivacyPolicyVersions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function PolicyAcceptanceModal() {
  const { currentPolicy, needsAcceptance, acceptPolicy, loading } = usePrivacyPolicyVersions();
  const [hasRead, setHasRead] = useState(false);
  const [accepting, setAccepting] = useState(false);

  if (loading || !needsAcceptance || !currentPolicy) {
    return null;
  }

  const handleAccept = async () => {
    setAccepting(true);
    try {
      await acceptPolicy(currentPolicy.id);
    } finally {
      setAccepting(false);
    }
  };

  return (
    <Dialog open={needsAcceptance} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0" hideCloseButton>
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{currentPolicy.title}</DialogTitle>
              <DialogDescription className="mt-1">
                Version {currentPolicy.version} • Effective à partir du{' '}
                {format(new Date(currentPolicy.effective_date), 'dd MMMM yyyy', { locale: fr })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 border-b bg-amber-50 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Mise à jour de notre politique de confidentialité
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Nous avons mis à jour notre politique de confidentialité. Veuillez prendre le temps de la lire
                attentivement avant de continuer à utiliser nos services.
              </p>
            </div>
          </div>
        </div>

        {currentPolicy.summary && (
          <div className="px-6 py-4 border-b bg-muted/30">
            <h4 className="font-semibold text-sm mb-2">Résumé des changements</h4>
            <p className="text-sm text-muted-foreground">{currentPolicy.summary}</p>
          </div>
        )}

        <ScrollArea className="flex-1 px-6 py-4" style={{ maxHeight: '400px' }}>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {currentPolicy.content}
            </div>
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/20">
          <label className="flex items-start gap-3 cursor-pointer group">
            <Checkbox
              id="policy-read"
              checked={hasRead}
              onCheckedChange={(checked) => setHasRead(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                J'ai lu et je comprends cette politique de confidentialité
              </p>
              <p className="text-xs text-muted-foreground">
                En acceptant, vous confirmez avoir lu et compris l'intégralité de cette politique.
              </p>
            </div>
          </label>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-background">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/logout'}
              className="w-full sm:w-auto"
            >
              Me déconnecter
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!hasRead || accepting}
              className="w-full sm:w-auto"
            >
              {accepting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Acceptation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accepter et continuer
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
