import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Play, Pause, Download, MoreHorizontal, Search, 
  Music, Trash, Edit, Share2, Bookmark, ListFilter, Grid2x2, List, Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface MusicCreation {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  duration: string;
  genre: string;
  mood: string;
}

const CreationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data for user creations
  const mockCreations: MusicCreation[] = [
    {
      id: '1',
      title: 'Morning Meditation',
      description: 'Une composition calme pour commencer la journée',
      createdAt: '2023-10-15',
      duration: '3:45',
      genre: 'ambient',
      mood: 'calm'
    },
    {
      id: '2',
      title: 'Productive Flow',
      description: 'Musique pour se concentrer et être productif',
      createdAt: '2023-10-10',
      duration: '4:20',
      genre: 'electronic',
      mood: 'focused'
    },
    {
      id: '3',
      title: 'Evening Relaxation',
      description: 'Sons apaisants pour la fin de journée',
      createdAt: '2023-10-05',
      duration: '5:15',
      genre: 'classical',
      mood: 'calm'
    },
    {
      id: '4',
      title: 'Energy Boost',
      description: 'Rythme dynamique pour se remotiver',
      createdAt: '2023-09-28',
      duration: '2:50',
      genre: 'electronic',
      mood: 'energetic'
    },
  ];

  const filteredCreations = mockCreations.filter(
    creation => creation.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                creation.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlay = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
      toast({
        title: "Lecture mise en pause",
        description: "La lecture de la musique a été mise en pause",
      });
    } else {
      setCurrentlyPlaying(id);
      toast({
        title: "Lecture démarrée",
        description: `"${mockCreations.find(c => c.id === id)?.title}" est en cours de lecture`,
      });
    }
  };

  const handleDelete = (_id: string) => {
    toast({
      title: "Suppression confirmée",
      description: "La composition a été supprimée de votre bibliothèque",
      variant: "destructive",
    });
  };

  const handleDownload = (_id: string) => {
    toast({
      title: "Téléchargement commencé",
      description: "Votre composition est en cours de téléchargement",
    });
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'energetic': return '⚡';
      case 'focused': return '🧠';
      case 'melancholic': return '🌧️';
      default: return '🎵';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Ma bibliothèque musicale</h2>
          <p className="text-muted-foreground">Gérez vos compositions personnalisées</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setViewMode('grid')}
            aria-label="Vue en grille"
          >
            <Grid2x2 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => setViewMode('list')}
            aria-label="Vue en liste"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Rechercher dans vos compositions..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="whitespace-nowrap">
          <ListFilter className="h-4 w-4 mr-2" />
          Filtrer
        </Button>
      </div>
      
      {filteredCreations.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Music className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium">Aucune composition trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Aucun résultat ne correspond à votre recherche" 
                : "Vous n'avez pas encore créé de compositions"}
            </p>
            <Button>Créer une nouvelle composition</Button>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCreations.map(creation => (
            <Card key={creation.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-3 bg-gradient-to-r from-primary to-primary/50"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{creation.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{creation.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Options">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(creation.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Ajouter aux favoris
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(creation.id)} className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <Badge variant="outline">
                    {getMoodEmoji(creation.mood)} {creation.mood}
                  </Badge>
                  <span>{creation.duration}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Créé le {formatDate(creation.createdAt)}
                  </span>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handlePlay(creation.id)}
                  >
                    {currentlyPlaying === creation.id ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Jouer
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCreations.map(creation => (
            <Card key={creation.id} className="hover:bg-muted/30 transition-colors">
              <div className="flex items-center p-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="mr-4"
                  onClick={() => handlePlay(creation.id)}
                  aria-label={currentlyPlaying === creation.id ? "Mettre en pause" : "Lire"}
                >
                  {currentlyPlaying === creation.id ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{creation.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{creation.description}</p>
                </div>
                
                <div className="hidden sm:flex items-center space-x-4 ml-4">
                  <Badge variant="outline">
                    {getMoodEmoji(creation.mood)} {creation.mood}
                  </Badge>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{creation.duration}</span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(creation.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(creation.id)} aria-label="Télécharger">
                    <Download className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Options">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className="h-4 w-4 mr-2" />
                        Ajouter aux favoris
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(creation.id)} className="text-destructive">
                        <Trash className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer une nouvelle composition
        </Button>
      </div>
    </div>
  );
};

export default CreationsList;
