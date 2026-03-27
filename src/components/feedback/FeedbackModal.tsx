// @ts-nocheck
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Bug, 
  Lightbulb, 
  MessageSquare, 
  Camera, 
  Loader2,
  Shield
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import { FeedbackCategory } from '@/store/feedback.store';

const CATEGORY_CONFIG = {
  bug: {
    icon: Bug,
    label: 'Signaler un bug',
    description: 'Un problème technique ou un dysfonctionnement'
  },
  suggestion: {
    icon: Lightbulb,
    label: 'Suggérer une amélioration',
    description: 'Une idée pour améliorer l\'expérience'
  },
  other: {
    icon: MessageSquare,
    label: 'Autre',
    description: 'Question générale ou autre sujet'
  }
};

/**
 * Modal de feedback avec formulaire complet
 */
export const FeedbackModal: React.FC = () => {
  const { 
    isOpen, 
    draft, 
    loading, 
    setOpen, 
    setDraft, 
    submit,
    captureScreenshot 
  } = useFeedback();

  // Validation simple
  const isValid = draft.category && 
                  draft.title && 
                  draft.title.length > 0 && 
                  draft.description && 
                  draft.description.length > 5;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    
    try {
      await submit(draft);
      setOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleScreenshot = async () => {
    const screenshot = await captureScreenshot();
    if (screenshot) {
      setDraft({ screenshot_base64: screenshot });
    }
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus will be managed by the dialog component
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent 
        className="sm:max-w-md"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>
            Aidez-nous à améliorer votre expérience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={draft.category}
              onValueChange={(category: FeedbackCategory) => 
                setDraft({ category })
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Choisissez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{config.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {config.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Titre
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Résumé en quelques mots..."
              value={draft.title || ''}
              onChange={(e) => setDraft({ title: e.target.value })}
              maxLength={80}
            />
            <div className="text-xs text-muted-foreground text-right">
              {(draft.title || '').length}/80
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème ou votre suggestion..."
              value={draft.description || ''}
              onChange={(e) => setDraft({ description: e.target.value })}
              rows={4}
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {(draft.description || '').length}/1000
            </div>
          </div>

          {/* Screenshot */}
          <div className="space-y-2">
            <Label>Capture d'écran (optionnel)</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScreenshot}
                type="button"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capturer l'écran
              </Button>
              {draft.screenshot_base64 && (
                <Badge variant="secondary">
                  Capture ajoutée
                </Badge>
              )}
            </div>
          </div>

          {/* Diagnostics */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="diagnostics"
                checked={draft.include_diagnostics || false}
                onCheckedChange={(checked) => 
                  setDraft({ include_diagnostics: !!checked })
                }
              />
              <Label htmlFor="diagnostics" className="text-sm">
                Inclure les diagnostics techniques
              </Label>
            </div>
            <div className="text-xs text-muted-foreground flex items-start gap-1">
              <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>
                Informations non-personnelles uniquement (navigateur, version, état réseau)
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};