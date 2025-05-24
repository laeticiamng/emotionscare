
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Plus, BookOpen, Calendar as CalendarIcon, Trash2, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  created_at: Date;
  updated_at: Date;
}

const Journal: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral'
  });

  const moods = [
    { value: 'very_happy', label: '😄 Très joyeux', color: 'bg-green-100 text-green-800' },
    { value: 'happy', label: '😊 Joyeux', color: 'bg-lime-100 text-lime-800' },
    { value: 'neutral', label: '😐 Neutre', color: 'bg-gray-100 text-gray-800' },
    { value: 'sad', label: '😢 Triste', color: 'bg-blue-100 text-blue-800' },
    { value: 'angry', label: '😡 En colère', color: 'bg-red-100 text-red-800' },
    { value: 'anxious', label: '😰 Anxieux', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      // Simulation du chargement depuis Supabase
      const mockEntries: JournalEntry[] = [
        {
          id: '1',
          title: 'Belle journée',
          content: 'Aujourd\'hui s\'est bien passé. J\'ai eu une réunion productive et j\'ai passé du temps avec ma famille.',
          mood: 'happy',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      setEntries(mockEntries);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement');
    }
  };

  const saveEntry = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        created_at: new Date(),
        updated_at: new Date()
      };

      setEntries(prev => [newEntry, ...prev]);
      setFormData({ title: '', content: '', mood: 'neutral' });
      setShowForm(false);
      toast.success('Entrée sauvegardée !');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      toast.success('Entrée supprimée');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getMoodInfo = (moodValue: string) => {
    return moods.find(m => m.value === moodValue) || moods[2];
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Journal personnel</h1>
          <p className="text-muted-foreground">
            Suivez vos émotions et vos pensées au quotidien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendrier */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendrier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Bouton nouvelle entrée */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Mes entrées</h2>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle entrée
                </Button>
              </div>

              {/* Formulaire nouvelle entrée */}
              {showForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nouvelle entrée de journal</CardTitle>
                    <CardDescription>
                      Partagez vos pensées et émotions du jour
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Titre de votre entrée"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Comment vous sentez-vous ?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {moods.map((mood) => (
                          <Badge
                            key={mood.value}
                            variant={formData.mood === mood.value ? "default" : "outline"}
                            className={`cursor-pointer ${formData.mood === mood.value ? mood.color : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                          >
                            {mood.label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Textarea
                      placeholder="Décrivez votre journée, vos émotions, vos pensées..."
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={6}
                    />

                    <div className="flex gap-2">
                      <Button onClick={saveEntry}>
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button variant="outline" onClick={() => setShowForm(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Liste des entrées */}
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">Aucune entrée de journal</p>
                      <p className="text-sm text-muted-foreground">Commencez par créer votre première entrée !</p>
                    </CardContent>
                  </Card>
                ) : (
                  entries.map((entry) => {
                    const moodInfo = getMoodInfo(entry.mood);
                    return (
                      <Card key={entry.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{entry.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={moodInfo.color}>
                                  {moodInfo.label}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {entry.created_at.toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => deleteEntry(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed">{entry.content}</p>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
