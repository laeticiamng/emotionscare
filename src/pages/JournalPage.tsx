
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types';
import { PlusCircle, Edit, Calendar } from 'lucide-react';

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchJournalEntries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (error) throw error;
        setEntries(data || []);
      } catch (error: any) {
        console.error('Error fetching journal entries:', error);
        toast({
          title: "Erreur",
          description: `Impossible de charger votre journal: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();
  }, [user, toast]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getContentPreview = (content: string) => {
    if (content.length <= 100) return content;
    return `${content.substring(0, 100)}...`;
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Journal guidé</h1>
        <Button onClick={() => navigate('/journal/new')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouvelle entrée
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : entries.length > 0 ? (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id}
              className="cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate(`/journal/${entry.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(entry.date)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {getContentPreview(entry.content)}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto gap-2">
                  <Edit className="h-4 w-4" />
                  Voir détails
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center p-8">
          <CardContent className="py-12">
            <h3 className="text-xl font-medium mb-2">Votre journal est vide</h3>
            <p className="text-muted-foreground mb-6">
              Commencez à écrire vos pensées et recevez des conseils personnalisés
            </p>
            <Button onClick={() => navigate('/journal/new')} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Créer ma première entrée
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JournalPage;
