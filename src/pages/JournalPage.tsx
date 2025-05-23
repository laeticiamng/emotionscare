
import React, { useState, useEffect } from 'react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useUserMode } from '@/contexts/UserModeContext';
import { Calendar, Book, Plus, Pencil, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import useOpenAI from '@/hooks/api/useOpenAI';

interface JournalEntry {
  id: string;
  content: string;
  date: string;
  title?: string;
  ai_feedback?: string;
  user_id: string;
  emotion?: string;
}

const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const { analyzeEmotion } = useOpenAI();
  const [loading, setLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [newEntry, setNewEntry] = useState('');
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  
  // Fetch journal entries
  useEffect(() => {
    const fetchJournalEntries = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
            
          if (error) throw error;
          
          setJournalEntries(data || []);
        } catch (error) {
          console.error('Error fetching journal entries:', error);
          toast.error('Erreur lors du chargement du journal');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchJournalEntries();
  }, [user]);
  
  // Handle new entry submission
  const handleSubmitEntry = async () => {
    if (!newEntry.trim() || !user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      // Get AI feedback
      let aiFeedback = '';
      let emotion = '';
      
      try {
        const analysis = await analyzeEmotion(newEntry);
        if (analysis) {
          aiFeedback = analysis.suggestions?.join(' ') || 'Merci pour votre entrée de journal.';
          emotion = analysis.primaryEmotion || '';
        }
      } catch (err) {
        console.error('Error analyzing emotion:', err);
        aiFeedback = 'Merci pour votre entrée de journal.';
      }
      
      const entryData = {
        user_id: user.id,
        content: newEntry,
        title: newEntryTitle || `Entrée du ${format(selectedDate || new Date(), 'd MMMM yyyy', { locale: fr })}`,
        date: (selectedDate || new Date()).toISOString(),
        ai_feedback: aiFeedback,
        emotion: emotion
      };
      
      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update(entryData)
          .eq('id', editingEntry.id);
        
        if (error) throw error;
        
        toast.success('Entrée de journal mise à jour avec succès');
        setEditingEntry(null);
      } else {
        // Create new entry
        const { data, error } = await supabase
          .from('journal_entries')
          .insert([entryData])
          .select();
        
        if (error) throw error;
        
        toast.success('Entrée de journal ajoutée avec succès');
      }
      
      // Refresh journal entries
      const { data: updatedData, error: fetchError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setJournalEntries(updatedData || []);
      
      // Reset form
      setNewEntry('');
      setNewEntryTitle('');
      setSelectedDate(new Date());
    } catch (error) {
      console.error('Error submitting journal entry:', error);
      toast.error('Erreur lors de l\'enregistrement de l\'entrée de journal');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle edit entry
  const handleEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry(entry.content);
    setNewEntryTitle(entry.title || '');
    setSelectedDate(new Date(entry.date));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle delete entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée de journal ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      
      if (error) throw error;
      
      // Update local state
      setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
      toast.success('Entrée supprimée avec succès');
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast.error('Erreur lors de la suppression de l\'entrée');
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setNewEntry('');
    setNewEntryTitle('');
    setSelectedDate(new Date());
  };
  
  const formatEntryDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM yyyy à HH:mm', { locale: fr });
  };
  
  const getEmotionColor = (emotion: string | undefined) => {
    if (!emotion) return 'bg-gray-200 text-gray-700';
    
    const emotions: { [key: string]: string } = {
      'joy': 'bg-yellow-100 text-yellow-800',
      'happiness': 'bg-yellow-100 text-yellow-800',
      'sadness': 'bg-blue-100 text-blue-800',
      'anger': 'bg-red-100 text-red-800',
      'fear': 'bg-purple-100 text-purple-800',
      'surprise': 'bg-green-100 text-green-800',
      'disgust': 'bg-orange-100 text-orange-800',
      'neutral': 'bg-gray-100 text-gray-800',
    };
    
    return emotions[emotion.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  // Filter entries based on active tab
  const filteredEntries = journalEntries.filter(entry => {
    if (activeTab === 'all') return true;
    if (activeTab === 'month') {
      const entryDate = new Date(entry.date);
      const currentDate = new Date();
      return entryDate.getMonth() === currentDate.getMonth() && 
             entryDate.getFullYear() === currentDate.getFullYear();
    }
    if (activeTab === 'week') {
      const entryDate = new Date(entry.date);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - entryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    return false;
  });
  
  return (
    <UnifiedLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Journal émotionnel</h1>
            <p className="text-muted-foreground">
              Explorez et documentez votre parcours émotionnel
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-3 lg:col-span-1">
            <CardHeader>
              <CardTitle>{editingEntry ? 'Modifier une entrée' : 'Nouvelle entrée'}</CardTitle>
              <CardDescription>
                Partagez vos pensées et expériences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Titre (optionnel)"
                    value={newEntryTitle}
                    onChange={(e) => setNewEntryTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Commencez à écrire..."
                    className="min-h-[200px]"
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={handleSubmitEntry}
                    disabled={isSubmitting || !newEntry.trim()}
                  >
                    {isSubmitting ? 'Enregistrement...' : editingEntry ? 'Mettre à jour' : 'Enregistrer'}
                  </Button>
                  
                  {editingEntry && (
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Mes entrées de journal</CardTitle>
                <CardDescription>
                  {journalEntries.length} entrées au total
                </CardDescription>
              </div>
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">Tout</TabsTrigger>
                  <TabsTrigger value="month">Ce mois</TabsTrigger>
                  <TabsTrigger value="week">Cette semaine</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[120px] w-full" />
                  ))}
                </div>
              ) : filteredEntries.length > 0 ? (
                <div className="space-y-6">
                  {filteredEntries.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">{entry.title}</h3>
                              {entry.emotion && (
                                <Badge className={getEmotionColor(entry.emotion)}>
                                  {entry.emotion}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {formatEntryDate(entry.date)}
                            </p>
                            <div className="whitespace-pre-line mt-2">{entry.content}</div>
                            {entry.ai_feedback && (
                              <div className="mt-2 bg-muted/50 p-2 rounded-md">
                                <p className="text-sm font-medium mb-1">Feedback AI:</p>
                                <p className="text-sm">{entry.ai_feedback}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditEntry(entry)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteEntry(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Book className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Pas d'entrées pour cette période</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {activeTab === 'all' ? 
                      "Commencez à écrire votre première entrée de journal" : 
                      `Aucune entrée pour ${activeTab === 'month' ? 'ce mois' : 'cette semaine'}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default JournalPage;
