
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface NewPlaylistDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreatePlaylist?: (name: string) => void;
}

const NewPlaylistDialog: React.FC<NewPlaylistDialogProps> = ({ 
  open, 
  setOpen, 
  onCreatePlaylist 
}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour la playlist",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (onCreatePlaylist) {
        await onCreatePlaylist(playlistName);
      }
      toast({
        title: "Playlist créée",
        description: `La playlist "${playlistName}" a été créée avec succès.`
      });
      setPlaylistName('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de créer la playlist",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                className="col-span-3"
                placeholder="Ma playlist personnalisée"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPlaylistDialog;
