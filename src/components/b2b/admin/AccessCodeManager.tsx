// @ts-nocheck
/**
 * Gestionnaire des codes d'accès institutionnels
 * Permet de créer, gérer et révoquer les codes d'accès B2B
 */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  QrCode,
  Link,
  Plus,
  Copy,
  MoreVertical,
  Trash2,
  RefreshCw,
  Check,
  Users,
  Calendar,
  Shield,
} from 'lucide-react';
import { useAccessCodes } from '@/hooks/b2b/useAccessCodes';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AccessCodeManagerProps {
  orgId: string;
}

export const AccessCodeManager: React.FC<AccessCodeManagerProps> = ({ orgId }) => {
  const { codes, loading, createCode, revokeCode, regenerateCode } = useAccessCodes(orgId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCodeName, setNewCodeName] = useState('');
  const [maxUses, setMaxUses] = useState<number | undefined>(undefined);
  const [expiresAt, setExpiresAt] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreateCode = async () => {
    if (!newCodeName.trim()) {
      toast.error('Veuillez entrer un nom pour le code');
      return;
    }

    setIsCreating(true);
    try {
      await createCode({
        name: newCodeName,
        maxUses: maxUses,
        expiresAt: expiresAt || undefined,
      });
      toast.success('Code d\'accès créé avec succès');
      setIsCreateDialogOpen(false);
      setNewCodeName('');
      setMaxUses(undefined);
      setExpiresAt('');
    } catch (error) {
      toast.error('Erreur lors de la création du code');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async (code: string) => {
    const url = `${window.location.origin}/b2b/access?code=${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(code);
    toast.success('Lien copié dans le presse-papier');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success('Code copié');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (codeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir révoquer ce code ? Les utilisateurs ne pourront plus l\'utiliser.')) {
      try {
        await revokeCode(codeId);
        toast.success('Code révoqué');
      } catch (error) {
        toast.error('Erreur lors de la révocation');
      }
    }
  };

  const handleRegenerate = async (codeId: string) => {
    if (confirm('Êtes-vous sûr de vouloir régénérer ce code ? L\'ancien code ne sera plus valide.')) {
      try {
        await regenerateCode(codeId);
        toast.success('Nouveau code généré');
      } catch (error) {
        toast.error('Erreur lors de la régénération');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Codes d'accès institutionnels
            </CardTitle>
            <CardDescription>
              Créez des liens d'accès anonymes pour vos collaborateurs
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un code d'accès</DialogTitle>
                <DialogDescription>
                  Ce code permettra à vos collaborateurs d'accéder à EmotionsCare de manière anonyme.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code-name">Nom du code</Label>
                  <Input
                    id="code-name"
                    placeholder="Ex: Équipe Marketing, Site Paris..."
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-uses">Nombre d'utilisations max (optionnel)</Label>
                  <Input
                    id="max-uses"
                    type="number"
                    placeholder="Illimité si vide"
                    value={maxUses || ''}
                    onChange={(e) => setMaxUses(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires-at">Date d'expiration (optionnel)</Label>
                  <Input
                    id="expires-at"
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateCode} disabled={isCreating}>
                  {isCreating ? 'Création...' : 'Créer le code'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Chargement des codes...
          </div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12">
            <QrCode className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-medium mb-2">Aucun code d'accès</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Créez votre premier code d'accès pour permettre à vos collaborateurs d'utiliser EmotionsCare.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un code
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-medium">{code.name}</TableCell>
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {code.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{code.usageCount}</span>
                      {code.maxUses && (
                        <span className="text-muted-foreground">/ {code.maxUses}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={code.isActive ? 'default' : 'secondary'}
                      className={code.isActive ? 'bg-success' : ''}
                    >
                      {code.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {code.expiresAt ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(code.expiresAt), 'dd MMM yyyy', { locale: fr })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Jamais</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(code.code)}
                      >
                        {copiedId === code.code ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(code.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRegenerate(code.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Régénérer le code
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleRevoke(code.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Révoquer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Avertissement éthique */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Engagement de confidentialité</p>
              <p>
                Les codes d'accès permettent une utilisation anonyme. Vous ne pourrez jamais
                identifier quels collaborateurs utilisent l'application ni accéder à leurs
                données personnelles.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessCodeManager;
