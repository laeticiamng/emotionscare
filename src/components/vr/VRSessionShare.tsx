import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Share2, Link2, Copy, Mail, MessageCircle, Users, 
  Lock, Globe, Eye, Clock, Download, QrCode, Check
} from 'lucide-react';
import { toast } from 'sonner';

interface VRSession {
  id: string;
  name: string;
  environment: string;
  duration: number;
  createdAt: Date;
  thumbnailUrl?: string;
}

interface ShareSettings {
  isPublic: boolean;
  allowComments: boolean;
  showDuration: boolean;
  expiresIn: '1h' | '24h' | '7d' | 'never';
  password?: string;
}

const VRSessionShare: React.FC = () => {
  const [session] = useState<VRSession>({
    id: 'vr-session-001',
    name: 'Méditation Forêt Enchantée',
    environment: 'forest_enchanted',
    duration: 900,
    createdAt: new Date(),
  });

  const [settings, setSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: true,
    showDuration: true,
    expiresIn: '7d',
  });

  const [shareLink, setShareLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');
  const [message, setMessage] = useState('');

  const generateShareLink = async () => {
    setIsGenerating(true);
    
    // Simuler la génération de lien
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const baseUrl = window.location.origin;
    const shareId = Math.random().toString(36).substring(2, 10);
    const link = `${baseUrl}/vr/shared/${shareId}`;
    
    setShareLink(link);
    setIsGenerating(false);
    toast.success('Lien de partage généré !');
  };

  const copyToClipboard = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success('Lien copié dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sendInvitations = async () => {
    const emails = inviteEmails.split(',').map(e => e.trim()).filter(Boolean);
    
    if (emails.length === 0) {
      toast.error('Veuillez entrer au moins une adresse email');
      return;
    }

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Invitations envoyées à ${emails.length} personne(s)`);
    setInviteEmails('');
    setMessage('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getExpiryLabel = (expiry: ShareSettings['expiresIn']) => {
    switch (expiry) {
      case '1h': return '1 heure';
      case '24h': return '24 heures';
      case '7d': return '7 jours';
      case 'never': return 'Jamais';
    }
  };

  return (
    <div className="space-y-6">
      {/* Aperçu de la session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager la Session VR
          </CardTitle>
          <CardDescription>
            Partagez votre expérience VR avec d'autres utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{session.name}</h3>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDuration(session.duration)}
                </span>
                <Badge variant="secondary">{session.environment}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Options de partage */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="link">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="link">
                <Link2 className="h-4 w-4 mr-2" />
                Lien
              </TabsTrigger>
              <TabsTrigger value="invite">
                <Mail className="h-4 w-4 mr-2" />
                Inviter
              </TabsTrigger>
              <TabsTrigger value="social">
                <MessageCircle className="h-4 w-4 mr-2" />
                Social
              </TabsTrigger>
            </TabsList>

            {/* Partage par lien */}
            <TabsContent value="link" className="space-y-6">
              {/* Paramètres de confidentialité */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      {settings.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      Visibilité
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {settings.isPublic ? 'Accessible à tous' : 'Lien privé uniquement'}
                    </p>
                  </div>
                  <Switch
                    checked={settings.isPublic}
                    onCheckedChange={(checked) => setSettings({ ...settings, isPublic: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Commentaires</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser les commentaires
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowComments}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowComments: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Afficher la durée</Label>
                    <p className="text-sm text-muted-foreground">
                      Montrer la durée de la session
                    </p>
                  </div>
                  <Switch
                    checked={settings.showDuration}
                    onCheckedChange={(checked) => setSettings({ ...settings, showDuration: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiration du lien</Label>
                  <div className="flex gap-2">
                    {(['1h', '24h', '7d', 'never'] as const).map((option) => (
                      <Button
                        key={option}
                        variant={settings.expiresIn === option ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSettings({ ...settings, expiresIn: option })}
                      >
                        {getExpiryLabel(option)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe (optionnel)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Protéger par mot de passe"
                    value={settings.password || ''}
                    onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                  />
                </div>
              </div>

              {/* Génération de lien */}
              <div className="space-y-3">
                {!shareLink ? (
                  <Button 
                    className="w-full" 
                    onClick={generateShareLink}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Génération...' : 'Générer le lien de partage'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="font-mono text-sm" />
                      <Button variant="outline" onClick={copyToClipboard}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Invitation par email */}
            <TabsContent value="invite" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emails">Adresses email</Label>
                <Textarea
                  id="emails"
                  placeholder="email1@example.com, email2@example.com"
                  value={inviteEmails}
                  onChange={(e) => setInviteEmails(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Séparez les adresses par des virgules
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message personnalisé (optionnel)</Label>
                <Textarea
                  id="message"
                  placeholder="Je t'invite à découvrir cette session VR..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Button className="w-full" onClick={sendInvitations}>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer les invitations
              </Button>
            </TabsContent>

            {/* Partage social */}
            <TabsContent value="social" className="space-y-4">
              <p className="text-sm text-muted-foreground text-center py-4">
                Partagez votre expérience sur les réseaux sociaux
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Communauté EmotionsCare</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4">
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-sm">WhatsApp</span>
                  </div>
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  💡 Astuce : Partagez vos sessions VR préférées avec la communauté 
                  pour inspirer les autres utilisateurs !
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sessions partagées récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sessions partagées récemment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Océan Calme', shares: 12, views: 45 },
              { name: 'Montagne Zen', shares: 8, views: 28 },
              { name: 'Jardin Japonais', shares: 5, views: 15 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">{item.name}</span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{item.shares} partages</span>
                  <span>{item.views} vues</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionShare;
