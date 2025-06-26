
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Users, Heart, MessageCircle, Shield, Send, Plus } from 'lucide-react';

const SocialCoconPage: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('general');

  const groups = [
    { id: 'general', name: 'Général', members: 142, color: 'bg-blue-100 text-blue-800' },
    { id: 'meditation', name: 'Méditation', members: 89, color: 'bg-purple-100 text-purple-800' },
    { id: 'motivation', name: 'Motivation', members: 156, color: 'bg-orange-100 text-orange-800' },
    { id: 'support', name: 'Entraide', members: 203, color: 'bg-green-100 text-green-800' }
  ];

  const messages = [
    {
      id: 1,
      author: 'Utilisateur Anonyme',
      content: 'Merci pour vos conseils hier, ça m\'a vraiment aidé à surmonter ma journée difficile. 💙',
      time: '2 min',
      likes: 12,
      responses: 3
    },
    {
      id: 2,
      author: 'Ami Bienveillant',
      content: 'Je partage une technique de respiration qui m\'aide beaucoup : 4 secondes d\'inspiration, 4 secondes de pause, 4 secondes d\'expiration. Simple mais efficace !',
      time: '15 min',
      likes: 28,
      responses: 7
    },
    {
      id: 3,
      author: 'Compagnon de Route',
      content: 'Qui d\'autre trouve que les matins sont les plus difficiles ? J\'aimerais des conseils pour bien commencer la journée.',
      time: '1h',
      likes: 19,
      responses: 15
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Communauté Bienveillante
            </Badge>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Cocoon
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un espace sécurisé et anonyme pour partager, écouter et grandir ensemble dans la bienveillance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">590</div>
              <div className="text-sm text-muted-foreground">Membres actifs</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">1,247</div>
              <div className="text-sm text-muted-foreground">Messages échangés</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold text-pink-600">3,891</div>
              <div className="text-sm text-muted-foreground">Cœurs partagés</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-muted-foreground">Sécurité garantie</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Groups */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Groupes</span>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedGroup === group.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{group.name}</span>
                      <Badge className={group.color}>{group.members}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card className="bg-white/80 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Règles du Cocoon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Respect et bienveillance</li>
                  <li>• Anonymat préservé</li>
                  <li>• Pas de jugement</li>
                  <li>• Écoute active</li>
                  <li>• Confidentialité absolue</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* New Message */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Partager avec la communauté</CardTitle>
                <CardDescription>
                  Votre message sera publié de façon anonyme et bienveillante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Que souhaitez-vous partager avec la communauté ? Vos expériences, questions ou encouragements sont les bienvenus..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant="outline">Anonyme</Badge>
                    <Badge variant="outline" className="text-green-600">Sécurisé</Badge>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Messages Feed */}
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-800">{message.author}</span>
                          <Badge variant="outline" className="text-xs">Anonyme</Badge>
                          <span className="text-sm text-muted-foreground">• {message.time}</span>
                        </div>
                        <p className="text-gray-700 mb-4">{message.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                            <Heart className="w-4 h-4 mr-1" />
                            {message.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {message.responses}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline" className="w-full md:w-auto">
                Charger plus de messages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCoconPage;
