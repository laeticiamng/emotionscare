/**
 * PlaylistShareModal - Modal de partage de playlist avec QR code et réseaux sociaux
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Copy,
  Download,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Music,
  TrendingUp,
  Clock,
  Users,
} from '@/components/music/icons';
import { usePlaylistShare } from '@/hooks/usePlaylistShare';
import { toast } from 'sonner';

interface PlaylistShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistName: string;
}

export const PlaylistShareModal: React.FC<PlaylistShareModalProps> = ({
  isOpen,
  onClose,
  playlistId,
  playlistName,
}) => {
  const { generateShareLink, shareToSocial, getPlaylistStats } = usePlaylistShare();
  const [shareData, setShareData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen && playlistId) {
      loadShareData();
      loadStats();
    }
  }, [isOpen, playlistId]);

  const loadShareData = async () => {
    const data = await generateShareLink(playlistId);
    setShareData(data);
  };

  const loadStats = async () => {
    const statsData = await getPlaylistStats(playlistId);
    setStats(statsData);
  };

  const copyToClipboard = () => {
    if (shareData?.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl);
      toast.success('Lien copié !');
    }
  };

  return (
    <LazyMotionWrapper>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Partager "{playlistName}"
          </DialogTitle>
          <DialogDescription>
            Partagez votre playlist avec vos amis ou sur les réseaux sociaux
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* QR Code */}
          {shareData?.shareUrl && (
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareData.shareUrl)}`}
                      alt="QR Code"
                      className="w-[200px] h-[200px]"
                    />
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">Scannez pour accéder à la playlist</p>
            </m.div>
          )}

          {/* Lien de partage */}
          {shareData?.shareUrl && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Lien de partage</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareData.shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-muted rounded-md text-sm"
                />
                <Button onClick={copyToClipboard} size="icon" variant="outline" aria-label="Copier le lien">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Partage réseaux sociaux */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Partager sur</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => shareToSocial('twitter', shareData?.shareUrl, playlistName)}
                variant="outline"
                className="gap-2"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button
                onClick={() => shareToSocial('facebook', shareData?.shareUrl, playlistName)}
                variant="outline"
                className="gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                onClick={() => shareToSocial('instagram', shareData?.shareUrl, playlistName)}
                variant="outline"
                className="gap-2"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Statistiques d'écoute</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div className="text-2xl font-bold">{stats.totalListens}</div>
                    <div className="text-xs text-muted-foreground">Écoutes</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div className="text-2xl font-bold">{stats.completionRate.toFixed(0)}%</div>
                    <div className="text-xs text-muted-foreground">Complétées</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div className="text-2xl font-bold">{Math.floor(stats.avgDuration / 60)}</div>
                    <div className="text-xs text-muted-foreground">Min moy.</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Music className="h-5 w-5 text-purple-500" />
                    <div className="text-2xl font-bold">{stats.completedListens}</div>
                    <div className="text-xs text-muted-foreground">Finies</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </LazyMotionWrapper>
  );
};
