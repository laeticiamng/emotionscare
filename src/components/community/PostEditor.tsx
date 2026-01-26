import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { Post } from '@/modules/community/communityService';

interface PostEditorProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (postId: string, updates: {
    content?: string;
    tags?: string[];
    mood?: string;
    category?: string;
  }) => Promise<void>;
}

const moods = [
  { value: 'happy', label: '😊 Heureux' },
  { value: 'calm', label: '😌 Calme' },
  { value: 'anxious', label: '😰 Anxieux' },
  { value: 'sad', label: '😢 Triste' },
  { value: 'energetic', label: '⚡ Énergique' },
  { value: 'neutral', label: '😐 Neutre' },
];

const categories = [
  { value: 'success', label: '🎉 Succès' },
  { value: 'support', label: '🤝 Soutien' },
  { value: 'question', label: '❓ Question' },
  { value: 'inspiration', label: '✨ Inspiration' },
  { value: 'general', label: '💬 Général' },
];

export function PostEditor({ post, open, onOpenChange, onSave }: PostEditorProps) {
  const [content, setContent] = useState(post.content);
  const [mood, setMood] = useState(post.mood || 'neutral');
  const [category, setCategory] = useState(post.category || 'general');
  const [tags, setTags] = useState<string[]>(post.tags || []);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && tags.length < 5 && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(post.id, {
        content,
        tags,
        mood,
        category
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le post</DialogTitle>
          <DialogDescription>
            Modifiez le contenu, l'humeur, la catégorie et les tags de votre post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre message..."
              className="min-h-[150px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {content.length} caractères
            </p>
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label>Comment vous sentez-vous ?</Label>
            <div className="flex flex-wrap gap-2">
              {moods.map((moodOption) => (
                <Button
                  key={moodOption.value}
                  type="button"
                  variant={mood === moodOption.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMood(moodOption.value)}
                >
                  {moodOption.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  type="button"
                  variant={category === cat.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (max 5)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Ajouter un tag..."
                  maxLength={20}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  aria-label="Ajouter le tag"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={!content.trim() || saving}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
