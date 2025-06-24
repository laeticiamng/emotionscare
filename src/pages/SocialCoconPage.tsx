
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, Users, Send, Plus, Smile } from 'lucide-react';

const SocialCoconPage: React.FC = () => {
  const [newPost, setNewPost] = useState('');
  const [selectedMood, setSelectedMood] = useState('');

  const moods = [
    { emoji: '😊', label: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😌', label: 'Paisible', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😔', label: 'Triste', color: 'bg-gray-100 text-gray-800' },
    { emoji: '😤', label: 'Frustré', color: 'bg-red-100 text-red-800' },
    { emoji: '🤗', label: 'Reconnaissant', color: 'bg-green-100 text-green-800' },
    { emoji: '😴', label: 'Fatigué', color: 'bg-purple-100 text-purple-800' }
  ];

  const posts = [
    {
      id: 1,
      author: 'Marie D.',
      avatar: '',
      time: 'Il y a 2 heures',
      mood: '😊',
      moodLabel: 'Joyeux',
      content: 'Magnifique séance de méditation ce matin ! Le soleil qui traverse ma fenêtre m\'a donné une énergie incroyable. Gratitude pour ce moment de paix 🌅',
      likes: 12,
      comments: 3,
      liked: false
    },
    {
      id: 2,
      author: 'Thomas L.',
      avatar: '',
      time: 'Il y a 4 heures',
      mood: '🤗',
      moodLabel: 'Reconnaissant',
      content: 'Petite victoire aujourd\'hui : j\'ai réussi à faire ma pause déjeuner sans regarder mes emails ! Merci aux conseils du coach EmotionsCare 💪',
      likes: 8,
      comments: 5,
      liked: true
    },
    {
      id: 3,
      author: 'Sophie R.',
      avatar: '',
      time: 'Il y a 6 heures',
      mood: '😌',
      moodLabel: 'Paisible',
      content: 'Session VR "Forêt Enchantée" terminée. Ces 15 minutes m\'ont transportée dans un autre monde. Parfait après une journée intense !',
      likes: 15,
      comments: 2,
      liked: false
    }
  ];

  const supportGroups = [
    { name: 'Gestion du Stress', members: 234, description: 'Techniques et soutien pour gérer le stress quotidien' },
    { name: 'Méditation Débutants', members: 156, description: 'Premiers pas dans la méditation avec bienveillance' },
    { name: 'Parents Épanouis', members: 189, description: 'Équilibre famille-travail et bien-être parental' },
    { name: 'Retour au Travail', members: 98, description: 'Soutien pour la réintégration professionnelle' }
  ];

  const handleLike = (postId: number) => {
    console.log('Like post:', postId);
  };

  const handleShare = (postId: number) => {
    console.log('Share post:', postId);
  };

  const handleSubmitPost = () => {
    if (newPost.trim() && selectedMood) {
      console.log('New post:', { content: newPost, mood: selectedMood });
      setNewPost('');
      setSelectedMood('');
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🫂 Social Cocon</h1>
          <p className="text-muted-foreground">Votre communauté bienveillante de soutien émotionnel</p>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feed">Fil d'actualité</TabsTrigger>
            <TabsTrigger value="groups">Groupes</TabsTrigger>
            <TabsTrigger value="support">Entraide</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Créer un post */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Partager un moment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Comment vous sentez-vous ?</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood.label}
                        variant={selectedMood === mood.label ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood(mood.label)}
                        className="h-auto px-3 py-2"
                      >
                        <span className="mr-2">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Partagez votre expérience, une victoire, ou demandez du soutien..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitPost} disabled={!newPost.trim() || !selectedMood}>
                    <Send className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{post.author}</h3>
                          <Badge variant="secondary" className="text-xs">
                            <span className="mr-1">{post.mood}</span>
                            {post.moodLabel}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{post.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className={post.liked ? 'text-red-500' : ''}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${post.liked ? 'fill-current' : ''}`} />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                            <Share2 className="w-4 h-4 mr-1" />
                            Partager
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {supportGroups.map((group, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{group.description}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          {group.members} membres
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Rejoindre le groupe</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>🆘 Besoin d'aide immédiate ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Si vous traversez une période difficile, n'hésitez pas à demander de l'aide.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-4">
                    <div className="text-center">
                      <div className="font-semibold">Chat de crise</div>
                      <div className="text-sm text-muted-foreground">Disponible 24h/7j</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto py-4">
                    <div className="text-center">
                      <div className="font-semibold">SOS Amitié</div>
                      <div className="text-sm text-muted-foreground">09 72 39 40 50</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>💝 Gestes de bienveillance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Petits gestes qui font la différence dans notre communauté :
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Offrir une écoute sans jugement</li>
                  <li>• Partager une expérience inspirante</li>
                  <li>• Proposer une technique qui vous a aidé</li>
                  <li>• Encourager les petites victoires</li>
                  <li>• Rappeler que personne n'est seul</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SocialCoconPage;
