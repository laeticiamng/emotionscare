
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import JournalEntryModal from '@/components/journal/JournalEntryModal';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  emotion: string;
  intensity: number;
  created_at: string;
}

const B2CJournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Erreur récupération entrées:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos entrées de journal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEntry = async (entryData: {
    title: string;
    content: string;
    emotion: string;
    intensity: number;
  }) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          ...entryData,
          user_id: user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      setIsModalOpen(false);
      
      // Envoyer l'événement analytics
      await supabase.functions.invoke('analytics', {
        body: {
          event: 'journalEntryAdded',
          properties: {
            emotion: entryData.emotion,
            intensity: entryData.intensity,
            contentLength: entryData.content.length
          }
        }
      });

      toast({
        title: "Entrée sauvegardée",
        description: "Votre entrée de journal a été ajoutée avec succès",
      });
    } catch (error) {
      console.error('Erreur sauvegarde entrée:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre entrée",
        variant: "destructive"
      });
    }
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      calm: '😌',
      excited: '🤩',
      confused: '😕',
      grateful: '🙏'
    };
    return emojiMap[emotion] || '😐';
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon Journal</h1>
            <p className="text-muted-foreground">Vos pensées et émotions</p>
          </div>
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Journal</h1>
          <p className="text-muted-foreground">
            Vos pensées et émotions au fil du temps
          </p>
        </div>
        <BookOpen className="h-8 w-8 text-primary" />
      </div>

      {/* Actions et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos entrées..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>

      {/* Liste des entrées */}
      {filteredEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'Aucun résultat' : 'Aucune entrée de journal'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés'
                : 'Commencez à écrire vos pensées et émotions'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première entrée
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-lg">{getEmotionEmoji(entry.emotion)}</span>
                      {entry.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Intensité: {entry.intensity}/10
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal pour ajouter une entrée */}
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
      />
    </div>
  );
};

export default B2CJournalPage;
