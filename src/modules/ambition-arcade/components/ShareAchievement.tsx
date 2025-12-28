/**
 * Composant de partage des réussites Ambition Arcade
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Check, 
  Trophy, 
  Twitter, 
  Linkedin,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareAchievementProps {
  type: 'goal' | 'achievement' | 'artifact' | 'level';
  title: string;
  description?: string;
  stats?: { label: string; value: string | number }[];
  icon?: string;
}

export const ShareAchievement: React.FC<ShareAchievementProps> = ({
  type,
  title,
  description,
  stats,
  icon = '🏆'
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareText = `${icon} ${title}\n${description || ''}\n\n#AmbitionArcade #EmotionsCare`;
  
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({ title: 'Copié !', description: 'Texte copié dans le presse-papier' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const typeLabels = {
    goal: 'Objectif',
    achievement: 'Succès',
    artifact: 'Artefact',
    level: 'Niveau'
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Partager votre réussite
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-gradient-to-br from-primary/10 via-background to-warning/10 rounded-lg border"
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">{icon}</div>
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {typeLabels[type]}
                </Badge>
                <h3 className="font-bold text-lg">{title}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">{description}</p>
                )}
                {stats && stats.length > 0 && (
                  <div className="flex gap-4 mt-3">
                    {stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleTwitterShare}
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleLinkedInShare}
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              className="flex-1 gap-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié !' : 'Copier le texte'}
            </Button>
            
            {'share' in navigator && (
              <Button 
                className="flex-1 gap-2"
                onClick={handleNativeShare}
              >
                <Share2 className="w-4 h-4" />
                Partager
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareAchievement;
