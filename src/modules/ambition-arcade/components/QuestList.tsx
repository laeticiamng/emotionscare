/**
 * Liste des quêtes pour un objectif Ambition Arcade
 */
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Plus, Swords, CheckCircle, Timer, ListFilter,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useAmbitionQuests, useCreateQuest, type AmbitionQuest } from '../hooks';
import { QuestCard } from './QuestCard';

interface QuestListProps {
  runId: string;
  showAddQuest?: boolean;
  compact?: boolean;
}

export const QuestList: React.FC<QuestListProps> = memo(({ 
  runId, 
  showAddQuest = true,
  compact = false 
}) => {
  const { data: quests, isLoading } = useAmbitionQuests(runId);
  const createQuest = useCreateQuest();
  
  const [showForm, setShowForm] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'in_progress' | 'completed'>('all');
  const [collapsed, setCollapsed] = useState(compact);

  const handleAddQuest = async () => {
    if (!newQuestTitle.trim()) return;
    
    await createQuest.mutateAsync({
      runId,
      title: newQuestTitle.trim()
    });
    
    setNewQuestTitle('');
    setShowForm(false);
  };

  const filteredQuests = quests?.filter(q => {
    if (activeTab === 'all') return true;
    return q.status === activeTab;
  }) || [];

  const availableCount = quests?.filter(q => q.status === 'available').length || 0;
  const inProgressCount = quests?.filter(q => q.status === 'in_progress').length || 0;
  const completedCount = quests?.filter(q => q.status === 'completed').length || 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (compact && collapsed) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setCollapsed(false)}
      >
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4" />
          <span>{quests?.length || 0} quêtes</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{completedCount}/{quests?.length || 0}</Badge>
          <ChevronDown className="w-4 h-4" />
        </div>
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4 text-primary" />
            Quêtes
            <Badge variant="outline" className="font-normal">
              {completedCount}/{quests?.length || 0}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {showAddQuest && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowForm(!showForm)}
                className="h-7 px-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            {compact && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCollapsed(true)}
                className="h-7 px-2"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Quest Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2"
            >
              <Input
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                placeholder="Nouvelle quête..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuest()}
                autoFocus
              />
              <Button
                onClick={handleAddQuest}
                disabled={!newQuestTitle.trim() || createQuest.isPending}
                size="sm"
              >
                Ajouter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Tabs */}
        {quests && quests.length > 0 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="all" className="text-xs h-7">
                <ListFilter className="w-3 h-3 mr-1" />
                Toutes
              </TabsTrigger>
              <TabsTrigger value="available" className="text-xs h-7">
                {availableCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center mr-1 text-[10px]">
                    {availableCount}
                  </span>
                )}
                À faire
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs h-7">
                {inProgressCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-1 text-[10px]">
                    {inProgressCount}
                  </span>
                )}
                <Timer className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs h-7">
                {completedCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-success/20 text-success flex items-center justify-center mr-1 text-[10px]">
                    {completedCount}
                  </span>
                )}
                <CheckCircle className="w-3 h-3" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Quest List */}
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredQuests.length > 0 ? (
              filteredQuests.map((quest) => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest}
                  showTimer={quest.status === 'in_progress'}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Swords className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {activeTab === 'all' 
                    ? 'Aucune quête pour cet objectif' 
                    : `Aucune quête ${activeTab === 'completed' ? 'complétée' : activeTab === 'in_progress' ? 'en cours' : 'disponible'}`
                  }
                </p>
                {showAddQuest && activeTab === 'all' && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter une quête
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
});

QuestList.displayName = 'QuestList';

export default QuestList;
