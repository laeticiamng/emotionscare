import React, { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CommunityReportService, REPORT_REASONS, ReportReason } from '@/modules/community/services';

interface ReportModalProps {
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  trigger?: React.ReactNode;
  onReported?: () => void;
}

export function ReportModal({ 
  targetType, 
  targetId, 
  trigger,
  onReported 
}: ReportModalProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('other');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (targetType === 'post') {
        await CommunityReportService.reportPost(targetId, reason, description);
      } else if (targetType === 'comment') {
        await CommunityReportService.reportComment(targetId, reason, description);
      } else {
        await CommunityReportService.reportUser(targetId, reason, description);
      }

      toast({
        title: 'Signalement envoyé',
        description: 'Merci, notre équipe de modération va examiner ce contenu.'
      });

      setOpen(false);
      setDescription('');
      setReason('other');
      onReported?.();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le signalement.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case 'post': return 'ce post';
      case 'comment': return 'ce commentaire';
      case 'user': return 'cet utilisateur';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Flag className="h-4 w-4 mr-1" />
            Signaler
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler {getTargetLabel()}</DialogTitle>
          <DialogDescription>
            Aidez-nous à maintenir un espace bienveillant et sécurisé.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Raison du signalement</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Description (optionnel)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez ce qui vous a mis mal à l'aise..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading} variant="destructive">
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Flag className="h-4 w-4 mr-2" />
            )}
            Signaler
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReportModal;
