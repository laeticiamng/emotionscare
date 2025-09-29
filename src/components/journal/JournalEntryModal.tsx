
import React, { useState } from 'react';
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
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: {
    title: string;
    content: string;
    emotion: string;
    intensity: number;
  }) => Promise<void>;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState([5]);
  const [isLoading, setIsLoading] = useState(false);

  const emotions = [
    { value: 'happy', label: '😊 Heureux' },
    { value: 'sad', label: '😢 Triste' },
    { value: 'angry', label: '😠 En colère' },
    { value: 'anxious', label: '😰 Anxieux' },
    { value: 'calm', label: '😌 Calme' },
    { value: 'excited', label: '🤩 Excité' },
    { value: 'confused', label: '😕 Confus' },
    { value: 'grateful', label: '🙏 Reconnaissant' },
  ];

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !emotion) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        emotion,
        intensity: intensity[0],
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setEmotion('');
      setIntensity([5]);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle entrée de journal</DialogTitle>
          <DialogDescription>
            Exprimez vos pensées et émotions du moment
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Donnez un titre à votre entrée..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              placeholder="Décrivez vos pensées, sentiments et expériences..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emotion">Émotion principale</Label>
            <Select value={emotion} onValueChange={setEmotion} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre émotion" />
              </SelectTrigger>
              <SelectContent>
                {emotions.map((emo) => (
                  <SelectItem key={emo.value} value={emo.value}>
                    {emo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Intensité émotionnelle: {intensity[0]}/10</Label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
              disabled={isLoading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title.trim() || !content.trim() || !emotion || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JournalEntryModal;
