
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Share2, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

const posts = [
  {
    id: 1,
    username: 'Anonyme',
    content: "Aujourd'hui j'ai fait face à mon anxiété en allant à un événement social. C'était difficile mais je suis fier d'avoir réussi!",
    likes: 24,
    comments: 5,
    tags: ['anxiété', 'victoire']
  },
  {
    id: 2,
    username: 'Anonyme',
    content: "Je me sens si fatiguée dernièrement. Quelqu'un a-t-il des astuces pour améliorer la qualité du sommeil?",
    likes: 18,
    comments: 12,
    tags: ['sommeil', 'aide']
  },
  {
    id: 3,
    username: 'Anonyme',
    content: "La méditation quotidienne a transformé ma gestion du stress. Je me sens plus calme et plus concentré après seulement deux semaines.",
    likes: 32,
    comments: 8,
    tags: ['méditation', 'stress']
  }
];

const B2CSocial: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Social Cocoon</h1>
        <p className="text-muted-foreground mb-6">
          Un espace bienveillant pour partager vos expériences et vous soutenir mutuellement.
        </p>
        
        <Tabs defaultValue="feed" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="feed">Fil d'actualités</TabsTrigger>
            <TabsTrigger value="discover">Découvrir</TabsTrigger>
            <TabsTrigger value="my">Mes publications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed">
            <div className="mb-6">
              <Card>
                <CardContent className="pt-6">
                  <textarea 
                    className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Partagez anonymement comment vous vous sentez aujourd'hui..."
                    rows={3}
                  ></textarea>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-muted-foreground">
                      100% anonyme • Respectez les règles de communauté
                    </div>
                    <Button>Publier</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium">{post.username}</div>
                      <div className="text-xs text-muted-foreground">Il y a 3h</div>
                    </div>
                    
                    <p className="mb-4">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <div key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          #{tag}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between border-t pt-3">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" /> {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" /> Partager
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Flag className="h-4 w-4" /> Signaler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
          
          <TabsContent value="discover">
            <Card>
              <CardHeader>
                <CardTitle>Découvrez des témoignages inspirants</CardTitle>
                <CardDescription>
                  Explorez des histoires de résilience et des conseils de bien-être partagés par la communauté.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {["Gestion du stress", "Sommeil", "Anxiété", "Méditation", "Nutrition & Bien-être", "Sport & Santé"].map(category => (
                    <Card key={category} className="cursor-pointer hover:bg-muted transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span>{category}</span>
                        <span className="text-xs bg-primary/20 px-2 py-1 rounded-full">+50 posts</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my">
            <Card>
              <CardHeader>
                <CardTitle>Mes publications</CardTitle>
                <CardDescription>
                  Retrouvez toutes vos publications et interactions dans la communauté.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  Vous n'avez pas encore publié de message dans la communauté.
                </p>
                <Button className="mt-4">Créer votre première publication</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default B2CSocial;
