
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Users, Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const SocialCoconPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: 'Sophie M.',
      avatar: '/api/placeholder/40/40',
      time: '2h',
      content: 'Aujourd\'hui j\'ai réussi à méditer 20 minutes sans interruption ! 🧘‍♀️ Les petites victoires comptent aussi.',
      likes: 12,
      comments: 3,
      mood: '😊',
      category: 'Méditation'
    },
    {
      id: 2,
      author: 'Alex D.',
      avatar: '/api/placeholder/40/40',
      time: '4h',
      content: 'Partage d\'une playlist qui m\'aide vraiment quand je me sens anxieux. La musique peut vraiment transformer notre état d\'esprit 🎵',
      likes: 8,
      comments: 5,
      mood: '🎵',
      category: 'Musique'
    },
    {
      id: 3,
      author: 'Marie L.',
      avatar: '/api/placeholder/40/40',
      time: '6h',
      content: 'Session de respiration guidée terminée ! Je me sens tellement plus centrée. Qui d\'autre pratique la cohérence cardiaque ?',
      likes: 15,
      comments: 7,
      mood: '🌟',
      category: 'Respiration'
    }
  ];

  const groups = [
    { name: 'Mindfulness au quotidien', members: 234, category: 'Méditation', color: 'bg-blue-100 text-blue-800' },
    { name: 'Musicothérapie', members: 156, category: 'Musique', color: 'bg-purple-100 text-purple-800' },
    { name: 'Gestion du stress', members: 189, category: 'Bien-être', color: 'bg-green-100 text-green-800' },
    { name: 'Parents zen', members: 98, category: 'Famille', color: 'bg-orange-100 text-orange-800' }
  ];

  const buddies = [
    { name: 'Sophie M.', status: 'En ligne', mood: '😊', streak: 7 },
    { name: 'Alex D.', status: 'Actif il y a 1h', mood: '🎵', streak: 12 },
    { name: 'Marie L.', status: 'En méditation', mood: '🧘', streak: 5 },
    { name: 'Tom R.', status: 'En ligne', mood: '⚡', streak: 3 }
  ];

  const renderFeed = () => (
    <div className="space-y-6">
      {/* New Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>Moi</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Partagez votre expérience, vos réussites ou demandez du soutien..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Humeur:</span>
                  <div className="flex space-x-1">
                    {['😊', '😌', '🤗', '💪', '🌟'].map((emoji) => (
                      <button key={emoji} className="text-lg hover:scale-110 transition-transform">
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <Button disabled={!newPost.trim()}>
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      {posts.map((post) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar>
                  <AvatarImage src={post.avatar} />
                  <AvatarFallback>{post.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{post.author}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{post.time}</span>
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <span className="text-xl">{post.mood}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <div className="flex items-center space-x-4 text-gray-500">
                    <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-green-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Groupes de soutien</h3>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Créer un groupe
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{group.name}</h4>
                  <p className="text-sm text-gray-600">{group.members} membres</p>
                </div>
                <Badge className={group.color}>
                  {group.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <Avatar key={i} className="w-6 h-6 border-2 border-white">
                      <AvatarImage src={`/api/placeholder/24/24`} />
                      <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-gray-500">+{group.members - 3} autres</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Rejoindre
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBuddies = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vos buddies bien-être</h3>
        <Button size="sm" variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Trouver des buddies
        </Button>
      </div>
      <div className="space-y-3">
        {buddies.map((buddy, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>{buddy.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{buddy.name}</span>
                      <span className="text-lg">{buddy.mood}</span>
                    </div>
                    <p className="text-sm text-gray-600">{buddy.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    🔥 {buddy.streak} jours
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Social Cocon
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connectez-vous avec une communauté bienveillante pour partager votre parcours bien-être
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'feed', label: 'Fil d\'actualité', icon: MessageCircle },
              { id: 'groups', label: 'Groupes', icon: Users },
              { id: 'buddies', label: 'Buddies', icon: Heart }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {activeTab === 'feed' && renderFeed()}
            {activeTab === 'groups' && renderGroups()}
            {activeTab === 'buddies' && renderBuddies()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Votre impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-sm text-gray-600">Posts d'encouragement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">128</div>
                  <div className="text-sm text-gray-600">Personnes aidées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Buddies actifs</div>
                </div>
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Règles de la communauté</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Bienveillance et respect mutuel</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Partage constructif d'expériences</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Soutien sans jugement</span>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sujets populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['#MéditationMatinale', '#GestionStress', '#Gratitude', '#SommeilRéparateur'].map((tag) => (
                    <Badge key={tag} variant="secondary" className="mr-2 mb-2">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCoconPage;
