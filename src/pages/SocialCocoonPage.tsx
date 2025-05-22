
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Send, Heart, MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Alex D.',
    content: "J'ai testé la technique de respiration du module détente. Ça m'a vraiment aidé à gérer le stress avant ma présentation !",
    likes: 12,
    comments: 3,
    timestamp: 'Il y a 2h'
  },
  {
    id: '2',
    author: 'Marina S.',
    content: "Qui veut rejoindre notre groupe de méditation du midi tous les jeudis ? On se retrouve en salle 3B.",
    likes: 8,
    comments: 5,
    timestamp: 'Il y a 4h'
  },
  {
    id: '3',
    author: 'Thomas L.',
    content: "Je cherche des conseils pour mieux gérer le stress lié aux deadlines. Des idées ?",
    likes: 5,
    comments: 7,
    timestamp: 'Il y a 1j'
  }
];

const mockGroups = [
  { id: '1', name: 'Gestion du stress', members: 24, description: 'Partage de techniques pour mieux gérer le stress au quotidien' },
  { id: '2', name: 'Méditation guidée', members: 18, description: 'Groupe pour organiser des sessions de méditation guidée' },
  { id: '3', name: 'Équilibre vie pro/perso', members: 31, description: 'Astuces et soutien pour un meilleur équilibre' }
];

const SocialCocoonPage: React.FC = () => {
  const { toast } = useToast();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  
  const showComingSoon = (feature: string) => {
    toast({
      title: "Fonctionnalité à venir",
      description: `${feature} est en cours de développement`,
    });
  };
  
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim() === '') return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: 'Moi',
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: 'À l\'instant'
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    
    toast({
      title: "Publication partagée",
      description: "Votre message a été publié anonymement",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Social Cocoon</h1>
        <p className="text-muted-foreground">Échangez anonymement avec vos collègues dans un espace bienveillant</p>
      </header>
      
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
          <TabsTrigger value="groups">Groupes</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partagez votre pensée</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit} className="flex space-x-2">
                <Input 
                  placeholder="Qu'avez-vous en tête ?" 
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {posts.map((post) => (
            <Card key={post.id} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    {post.authorAvatar && <AvatarImage src={post.authorAvatar} />}
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => showComingSoon("La fonctionnalité de like")}
                >
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => showComingSoon("La fonctionnalité de commentaire")}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="groups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Groupes d'entraide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGroups.map(group => (
                  <Card key={group.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      <p className="text-xs mt-2">{group.members} membres</p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => showComingSoon("L'accès aux groupes")}
                        variant="outline"
                      >
                        Rejoindre
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => showComingSoon("La création de groupe")}
              >
                Créer un nouveau groupe
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages privés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                La messagerie privée sera disponible prochainement. Vous pourrez échanger de manière anonyme et sécurisée avec d'autres utilisateurs.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => showComingSoon("La messagerie privée")}>
                  Activer les notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-xs text-center text-muted-foreground">
        <p>Tous les échanges sont anonymisés et respectent nos engagements de confidentialité.</p>
        <p className="mt-1">En cas de besoin, contactez un modérateur via l'option "Signaler".</p>
      </div>
    </div>
  );
};

export default SocialCocoonPage;
