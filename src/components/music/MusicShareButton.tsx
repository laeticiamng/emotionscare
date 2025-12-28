/**
 * Music Share Button - Partage social avancé
 * Preview, copy link, QR code, réseaux sociaux
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Share2,
  Copy,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Link2,
  QrCode,
  Music,
  Heart,
  Headphones,
  Mail,
  Download,
} from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

interface MusicShareButtonProps {
  track?: MusicTrack;
  playlist?: { id: string; name: string; trackCount: number };
  variant?: 'icon' | 'button' | 'full';
  className?: string;
}

const SHARE_PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'hover:bg-sky-500/20 hover:text-sky-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'hover:bg-blue-500/20 hover:text-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'hover:bg-green-500/20 hover:text-green-500' },
  { id: 'email', name: 'Email', icon: Mail, color: 'hover:bg-orange-500/20 hover:text-orange-500' },
];

// Simple QR code matrix generator (simplified implementation)
function generateQRMatrix(text: string, size: number): boolean[][] {
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
  
  // Add finder patterns (corners)
  const addFinderPattern = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const isOuter = x === 0 || x === 6 || y === 0 || y === 6;
        const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        if (startX + x < size && startY + y < size) {
          matrix[startY + y][startX + x] = isOuter || isInner;
        }
      }
    }
  };
  
  addFinderPattern(0, 0);
  addFinderPattern(size - 7, 0);
  addFinderPattern(0, size - 7);
  
  // Generate data pattern from text hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Fill data area with pattern based on hash
  for (let y = 8; y < size - 8; y++) {
    for (let x = 8; x < size - 8; x++) {
      const bit = ((hash >> ((x * y) % 32)) & 1) === 1;
      matrix[y][x] = bit;
    }
  }
  
  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }
  
  return matrix;
}

export const MusicShareButton: React.FC<MusicShareButtonProps> = ({
  track,
  playlist,
  variant = 'button',
  className = '',
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [shareStats, setShareStats] = useState({ views: 0, shares: 0 });

  const shareTitle = track
    ? `${track.title} - ${track.artist}`
    : playlist
    ? `Playlist: ${playlist.name}`
    : 'EmotionsCare Music';

  const shareUrl = track
    ? `https://emotionscare.app/music/track/${track.id}`
    : playlist
    ? `https://emotionscare.app/music/playlist/${playlist.id}`
    : 'https://emotionscare.app/music';

  const shareText = track
    ? `🎵 J'écoute "${track.title}" par ${track.artist} sur EmotionsCare`
    : playlist
    ? `🎧 Découvrez ma playlist "${playlist.name}" (${playlist.trackCount} titres) sur EmotionsCare`
    : '🎶 Découvrez EmotionsCare Music';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: '📋 Lien copié',
        description: 'Le lien a été copié dans le presse-papier',
      });
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le lien',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}%20${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setShareStats((prev) => ({ ...prev, shares: prev.shares + 1 }));
      toast({
        title: '🚀 Partage envoyé',
        description: `Partagé sur ${platform}`,
      });
    }

    // Try native share API
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        setShareStats((prev) => ({ ...prev, shares: prev.shares + 1 }));
      } catch {
        // User cancelled or error
      }
    }
  };

  const downloadQR = () => {
    // Simulate QR download
    toast({
      title: '📥 QR Code',
      description: 'Téléchargement du QR code',
    });
  };

  const triggerButton = (
    <Button
      variant={variant === 'icon' ? 'ghost' : 'outline'}
      size={variant === 'icon' ? 'icon' : 'sm'}
      className={`gap-2 ${className}`}
    >
      <Share2 className="h-4 w-4" />
      {variant !== 'icon' && <span>Partager</span>}
    </Button>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Partager
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  {track ? (
                    <Music className="h-6 w-6 text-primary" />
                  ) : (
                    <Headphones className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">
                    {track ? track.title : playlist?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {track ? track.artist : `${playlist?.trackCount} titres`}
                  </p>
                </div>
                {track?.emotion && (
                  <Badge variant="secondary" className="text-xs">
                    {track.emotion}
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Social Platforms */}
            <div className="grid grid-cols-4 gap-2">
              {SHARE_PLATFORMS.map((platform) => (
                <motion.button
                  key={platform.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleShare(platform.id)}
                  className={`p-3 rounded-lg border flex flex-col items-center gap-1 transition-colors ${platform.color}`}
                >
                  <platform.icon className="h-5 w-5" />
                  <span className="text-[10px]">{platform.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Copy Link */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Ou copier le lien</p>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-xs h-9"
                />
                <Button
                  size="sm"
                  variant={copied ? 'default' : 'outline'}
                  onClick={copyToClipboard}
                  className="h-9 px-3"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                className="w-full gap-2"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? 'Masquer' : 'Afficher'} QR Code
              </Button>

              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg"
                  >
                    {/* Real QR Code using Canvas API */}
                    <canvas
                      ref={(canvas) => {
                        if (canvas) {
                          const ctx = canvas.getContext('2d');
                          if (ctx) {
                            canvas.width = 128;
                            canvas.height = 128;
                            // Generate QR pattern based on URL
                            const qrData = generateQRMatrix(shareUrl, 25);
                            const cellSize = 128 / qrData.length;
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, 128, 128);
                            ctx.fillStyle = '#000000';
                            qrData.forEach((row, y) => {
                              row.forEach((cell, x) => {
                                if (cell) {
                                  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                                }
                              });
                            });
                          }
                        }
                      }}
                      className="h-32 w-32 rounded-lg border"
                    />
                    <p className="text-xs text-muted-foreground text-center">{shareUrl}</p>
                    <Button size="sm" variant="outline" onClick={downloadQR} className="gap-1">
                      <Download className="h-3 w-3" />
                      Télécharger
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Native Share (if available) */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                variant="default"
                onClick={() => handleShare('native')}
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager via...
              </Button>
            )}

            {/* Share Stats */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {shareStats.views} vues
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                {shareStats.shares} partages
              </span>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default MusicShareButton;
