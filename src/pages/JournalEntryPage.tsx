
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Clock, TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import JournalPageHeader from '@/components/journal/JournalPageHeader';

// Interface de l'entrée de journal
interface JournalEntry {
  id: string;
  title: string;
  date: Date;
  mood: string;
  content: string;
  tags: string[];
}

// Données de démonstration
const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'Journée productive',
    date: new Date('2023-05-10T14:00:00'),
    mood: 'happy',
    content: 'Aujourd\'hui était une journée très productive. J\'ai terminé plusieurs tâches importantes et je me sens satisfait de mes accomplissements. J\'ai commencé par une séance de méditation matinale qui m\'a aidé à me concentrer toute la journée. Ensuite, j\'ai travaillé sur mon projet pendant plusieurs heures sans interruption, ce qui m\'a permis d\'avancer significativement. J\'ai également eu une réunion constructive avec mon équipe où nous avons résolu plusieurs problèmes qui traînaient depuis un moment.\n\nPour finir la journée, j\'ai pris le temps de faire une promenade en extérieur pour décompresser et réfléchir à ma journée. C\'est important pour moi de prendre ces moments de pause pour maintenir mon équilibre mental.',
    tags: ['travail', 'productivité', 'satisfaction']
  },
  {
    id: '2',
    title: 'Promenade au parc',
    date: new Date('2023-05-08T18:30:00'),
    mood: 'calm',
    content: 'J\'ai fait une longue promenade au parc ce soir. Le temps était parfait et j\'ai pu me détendre et réfléchir tranquillement. Marcher dans la nature a toujours un effet apaisant sur moi. J\'ai observé les arbres, écouté les oiseaux et simplement profité du moment présent sans me soucier de mes responsabilités quotidiennes.\n\nJ\'ai remarqué que ces moments de solitude dans la nature m\'aident à remettre les choses en perspective et à diminuer mon niveau de stress. Je devrais essayer d\'intégrer ces promenades plus régulièrement dans ma routine.',
    tags: ['nature', 'détente', 'réflexion']
  },
  {
    id: '3',
    title: 'Discussion difficile',
    date: new Date('2023-05-05T10:15:00'),
    mood: 'anxious',
    content: 'J\'ai dû avoir une conversation difficile aujourd\'hui. Bien que stressant, je pense que c\'était nécessaire et finalement bénéfique. Ce n\'était pas facile d\'exprimer mes préoccupations, mais je suis fier d\'avoir pu communiquer clairement et honnêtement.\n\nJ\'ai remarqué que mon anxiété avant la conversation était bien pire que la conversation elle-même. C\'est souvent le cas - j\'anticipe le pire, mais la réalité est rarement aussi terrible que ce que j\'imagine. C\'est une leçon importante à retenir pour les futures situations stressantes.\n\nMaintenant que c\'est fait, je me sens soulagé et plus léger. Parfois, affronter nos peurs est le meilleur moyen de les surmonter.',
    tags: ['communication', 'défi', 'croissance']
  }
];

const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simuler le chargement des données
    setIsLoading(true);
    
    setTimeout(() => {
      const foundEntry = mockJournalEntries.find(e => e.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
      }
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  const handleEditEntry = () => {
    // Dans une application réelle, naviguer vers une page d'édition
    toast({
      title: "Fonctionnalité en développement",
      description: "L'édition des entrées de journal sera disponible prochainement."
    });
  };
  
  const handleDeleteEntry = () => {
    // Dans une application réelle, demander confirmation et supprimer
    toast({
      title: "Êtes-vous sûr?",
      description: "Cette fonctionnalité sera bientôt disponible."
    });
  };
  
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      case 'sad': return '😢';
      case 'angry': return '😠';
      default: return '😐';
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!entry) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <JournalPageHeader title="Entrée non trouvée" />
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">Cette entrée de journal n'existe pas ou a été supprimée.</p>
              <Button onClick={() => navigate('/journal')}>Retour au journal</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <JournalPageHeader title={entry.title} />
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                <div>
                  <Badge>
                    {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                  </Badge>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(entry.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEditEntry}>
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeleteEntry}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              {entry.content.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            
            {entry.tags.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center mb-2">
                  <TagIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags :</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JournalEntryPage;
