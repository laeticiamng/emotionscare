
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Edit, List, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import Shell from '@/Shell';

// Mock data pour les entrées de journal
const journalEntries = [
  {
    id: '1',
    title: 'Journée productive',
    excerpt: 'Aujourd\'hui, j\'ai accompli plusieurs tâches importantes...',
    date: '2025-05-20',
    mood: 'Heureux',
    tags: ['travail', 'accomplissement']
  },
  {
    id: '2',
    title: 'Rencontre inspirante',
    excerpt: 'J\'ai eu une conversation fascinante avec un mentor...',
    date: '2025-05-18',
    mood: 'Inspiré',
    tags: ['développement personnel', 'motivation']
  },
  {
    id: '3',
    title: 'Journée difficile',
    excerpt: 'Beaucoup de défis aujourd\'hui, mais j\'ai réussi à...',
    date: '2025-05-15',
    mood: 'Fatigué',
    tags: ['défis', 'persévérance']
  }
];

const JournalPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredEntries = journalEntries.filter(entry => 
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.mood.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon Journal</h1>
              <p className="text-muted-foreground">
                Conservez et explorez vos pensées, émotions et expériences
              </p>
            </div>
            <Button 
              onClick={() => navigate('/journal/new')} 
              className="flex items-center gap-2"
              size="lg"
            >
              <Plus size={18} />
              Nouvelle entrée
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans votre journal..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Liste
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              {filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="mb-1">{entry.title}</CardTitle>
                              <CardDescription>{new Date(entry.date).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'long', 
                                year: 'numeric' 
                              })}</CardDescription>
                            </div>
                            <div className="text-sm font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                              {entry.mood}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 pb-2">
                          <p className="text-muted-foreground">{entry.excerpt}</p>
                        </CardContent>
                        <CardFooter className="pt-3 flex justify-between items-center border-t">
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                className="text-xs bg-muted px-2 py-1 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            asChild
                            className="flex items-center gap-1"
                          >
                            <Link to={`/journal/${entry.id}`}>
                              <Edit className="h-3 w-3" />
                              <span>Voir</span>
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Aucune entrée ne correspond à votre recherche</p>
                  <Button onClick={() => setSearchTerm('')} variant="outline">
                    Effacer la recherche
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="calendar">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Vue Calendrier à venir</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Visualisez vos entrées de journal sur un calendrier pour suivre vos émotions et expériences au fil du temps.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/coming-soon">En savoir plus</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Shell>
  );
};

export default JournalPage;
