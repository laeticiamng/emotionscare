/**
 * VersionSelector - Sélecteur et gestionnaire de versions de trajectoires
 */
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GitCompare,
  Plus,
  Check,
  MoreVertical,
  Copy,
  Trash2,
  Edit,
  Calendar,
  Target,
  History,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { TimeVersion, CreateVersionInput } from '@/hooks/timecraft';

interface VersionSelectorProps {
  versions: TimeVersion[];
  activeVersion: TimeVersion | null;
  onSetActive: (id: string) => Promise<unknown>;
  onCreate: (input: CreateVersionInput) => Promise<TimeVersion>;
  onDuplicate: (sourceId: string, newName: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  isLoading?: boolean;
}

const versionTypeConfig = {
  current: { icon: Calendar, label: 'Temps actuel', color: 'text-blue-600' },
  ideal: { icon: Target, label: 'Temps souhaité', color: 'text-green-600' },
  past: { icon: History, label: 'Temps passé', color: 'text-gray-600' },
  scenario: { icon: Lightbulb, label: 'Scénario', color: 'text-purple-600' },
};

export const VersionSelector = memo(function VersionSelector({
  versions,
  activeVersion,
  onSetActive,
  onCreate,
  onDuplicate,
  onDelete,
  isLoading = false,
}: VersionSelectorProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState<string | null>(null);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionType, setNewVersionType] = useState<'current' | 'ideal' | 'past' | 'scenario'>('scenario');
  const [duplicateName, setDuplicateName] = useState('');

  const handleCreate = async () => {
    if (!newVersionName.trim()) return;
    
    await onCreate({
      name: newVersionName,
      version_type: newVersionType,
    });
    
    setNewVersionName('');
    setShowCreateDialog(false);
  };

  const handleDuplicate = async () => {
    if (!showDuplicateDialog || !duplicateName.trim()) return;
    
    await onDuplicate(showDuplicateDialog, duplicateName);
    
    setDuplicateName('');
    setShowDuplicateDialog(null);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <CardTitle>Versions de trajectoires</CardTitle>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle version
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une nouvelle trajectoire</DialogTitle>
                <DialogDescription>
                  Définissez une nouvelle architecture temporelle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    placeholder="Ma nouvelle trajectoire"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={newVersionType} onValueChange={(v: any) => setNewVersionType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(versionTypeConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className={cn('h-4 w-4', config.color)} />
                              {config.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate} disabled={!newVersionName.trim()}>
                  Créer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          Comparez différentes architectures temporelles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {versions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <GitCompare className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>Aucune version créée</p>
              <p className="text-sm mt-1">Créez votre première trajectoire temporelle</p>
            </motion.div>
          ) : (
            versions.map((version, index) => {
              const config = versionTypeConfig[version.version_type];
              const Icon = config.icon;
              const isActive = version.is_active;

              return (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      'transition-all cursor-pointer hover:shadow-md',
                      isActive && 'border-primary/50 bg-primary/5'
                    )}
                    onClick={() => !isActive && onSetActive(version.id)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded-lg bg-muted', config.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{version.name}</span>
                            {isActive && (
                              <Badge variant="default" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {config.label} • Créée le {format(new Date(version.created_at), 'dd MMM yyyy', { locale: fr })}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setDuplicateName(`${version.name} (copie)`);
                            setShowDuplicateDialog(version.id);
                          }}>
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliquer
                          </DropdownMenuItem>
                          {!isActive && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(version.id);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Duplicate Dialog */}
        <Dialog open={!!showDuplicateDialog} onOpenChange={() => setShowDuplicateDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dupliquer la trajectoire</DialogTitle>
              <DialogDescription>
                Créez une copie avec tous les blocs temporels
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium">Nom de la copie</label>
              <Input
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Nouvelle trajectoire"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDuplicateDialog(null)}>
                Annuler
              </Button>
              <Button onClick={handleDuplicate} disabled={!duplicateName.trim()}>
                <Copy className="h-4 w-4 mr-2" />
                Dupliquer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default VersionSelector;
