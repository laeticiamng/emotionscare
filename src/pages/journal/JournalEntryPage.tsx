
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Shell from '@/Shell';
import { Badge } from '@/components/ui/badge';

// Données simulées pour l'entrée de journal
const journalEntries = {
  '1': {
    id: '1',
    title: 'Journée productive',
    content: `Aujourd'hui a été une journée exceptionnellement productive. J'ai commencé tôt le matin avec une séance de méditation qui m'a permis de me concentrer sur mes objectifs pour la journée.

J'ai ensuite travaillé sur mon projet principal et j'ai accompli beaucoup plus que prévu. La clarté mentale que j'ai ressentie tout au long de la journée était remarquable.

Je pense que les nouvelles habitudes que j'ai mises en place commencent vraiment à porter leurs fruits. Il est important pour moi de continuer sur cette lancée et de maintenir cette discipline quotidienne.`,
    date: '2025-05-20',
    mood: 'Heureux',
    tags: ['travail', 'accomplissement', 'méditation'],
    emotionalScore: 85
  },
  '2': {
    id: '2',
    title: 'Rencontre inspirante',
    content: `J'ai eu une conversation fascinante avec un mentor aujourd'hui. Ses conseils sur la gestion de carrière et le développement personnel ont vraiment résonné en moi.

Ce qui m'a le plus marqué, c'est sa perspective sur la façon dont les défis que nous rencontrons sont en réalité des opportunités de croissance déguisées. Je dois garder cela à l'esprit lors des moments difficiles.

J'ai pris plusieurs notes pendant notre conversation que je dois revoir et intégrer dans mon plan de développement personnel.`,
    date: '2025-05-18',
    mood: 'Inspiré',
    tags: ['développement personnel', 'motivation', 'mentorat'],
    emotionalScore: 92
  },
  '3': {
    id: '3',
    title: 'Journée difficile',
    content: `Aujourd'hui a été rempli de défis. J'ai rencontré plusieurs obstacles dans mon projet principal, et à un moment donné, j'ai sérieusement envisagé d'abandonner.

Cependant, après avoir pris un peu de recul et réfléchi à la situation, j'ai trouvé une nouvelle approche qui pourrait fonctionner. C'est un bon rappel que parfois, nous devons simplement persévérer et continuer à essayer différentes solutions.

Je suis fatigué, mais je me sens également résilient. Ces expériences renforcent ma détermination et ma capacité à faire face à l'adversité.`,
    date: '2025-05-15',
    mood: 'Fatigué',
    tags: ['défis', 'persévérance', 'résilience'],
    emotionalScore: 65
  }
};

const JournalEntryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entry = id ? journalEntries[id] : null;

  if (!entry) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Entrée non trouvée</h2>
          <p className="mb-8 text-muted-foreground">
            L'entrée de journal que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button asChild>
            <Link to="/journal">Retour au journal</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            onClick={() => navigate('/journal')} 
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour au journal
          </Button>

          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl">{entry.title}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(entry.date).toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                <Badge className="w-fit text-sm py-1 px-3" variant="outline">
                  {entry.mood}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {entry.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2">
                {entry.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Analyse émotionnelle</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score émotionnel</span>
                    <span className="text-sm font-bold">{entry.emotionalScore}/100</span>
                  </div>
                  <div className="w-full bg-muted-foreground/20 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${entry.emotionalScore}%` }}
                    ></div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Cette entrée reflète un état émotionnel {entry.emotionalScore > 80 ? 'très positif' : entry.emotionalScore > 60 ? 'positif' : 'neutre'}.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => navigate(`/journal/edit/${entry.id}`)} className="flex items-center gap-2">
                <Edit size={16} />
                Modifier
              </Button>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 size={16} />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </Shell>
  );
};

export default JournalEntryPage;
