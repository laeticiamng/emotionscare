import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Heart, MessageCircle, Share2, Bookmark, 
         Search, Filter, Sparkles, Leaf, Sun, Moon, Cloud, Wind } from 'lucide-react';

interface CoconContent {
  id: string;
  type: 'reflection' | 'gratitude' | 'intention' | 'memory';
  title: string;
  content: string;
  date: Date;
  mood: 'peaceful' | 'joyful' | 'contemplative' | 'hopeful';
  isPrivate: boolean;
  tags: string[];
}

const B2CCoconPage: React.FC = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newContent, setNewContent] = useState({
    type: 'reflection' as const,
    title: '',
    content: '',
    isPrivate: true,
    tags: ''
  });

  const [coconItems] = useState<CoconContent[]>([
    {
      id: '1',
      type: 'gratitude',
      title: 'Gratitude pour cette belle journée',
      content: 'Aujourd\'hui, je suis reconnaissant(e) pour le soleil qui brille, les sourires des passants, et ce moment de calme que je m\'accorde...',
      date: new Date('2024-01-15T10:30:00'),
      mood: 'joyful',
      isPrivate: true,
      tags: ['nature', 'paix', 'bonheur']
    },
    {
      id: '2',
      type: 'reflection',
      title: 'Réflexion sur mes priorités',
      content: 'En prenant du recul sur ma semaine, je réalise l\'importance de prendre soin de moi et de mes relations...',
      date: new Date('2024-01-14T18:45:00'),
      mood: 'contemplative',
      isPrivate: true,
      tags: ['réflexion', 'équilibre', 'priorités']
    },
    {
      id: '3',
      type: 'intention',
      title: 'Intention pour demain',
      content: 'Je souhaite aborder demain avec bienveillance envers moi-même et patience dans mes interactions...',
      date: new Date('2024-01-13T20:15:00'),
      mood: 'hopeful',
      isPrivate: true,
      tags: ['intention', 'bienveillance', 'patience']
    },
    {
      id: '4',
      type: 'memory',
      title: 'Souvenir précieux',
      content: 'Ce moment partagé avec ma famille dimanche dernier restera gravé dans ma mémoire comme un instant de pure joie...',
      date: new Date('2024-01-12T16:20:00'),
      mood: 'joyful',
      isPrivate: false,
      tags: ['famille', 'joie', 'souvenirs']
    }
  ]);

  const contentTypes = {
    reflection: { 
      label: 'Réflexion', 
      icon: '🤔', 
      color: 'bg-blue-100 text-blue-800',
      description: 'Pensées et introspections personnelles'
    },
    gratitude: { 
      label: 'Gratitude', 
      icon: '🙏', 
      color: 'bg-green-100 text-green-800',
      description: 'Moments et personnes pour lesquels vous êtes reconnaissant(e)'
    },
    intention: { 
      label: 'Intention', 
      icon: '🎯', 
      color: 'bg-purple-100 text-purple-800',
      description: 'Objectifs et aspirations pour l\'avenir'
    },
    memory: { 
      label: 'Souvenir', 
      icon: '💝', 
      color: 'bg-pink-100 text-pink-800',
      description: 'Moments précieux à conserver'
    }
  };

  const moodConfig = {
    peaceful: { icon: Cloud, color: 'bg-blue-500', label: 'Paisible' },
    joyful: { icon: Sun, color: 'bg-yellow-500', label: 'Joyeux' },
    contemplative: { icon: Moon, color: 'bg-indigo-500', label: 'Contemplatif' },
    hopeful: { icon: Sparkles, color: 'bg-green-500', label: 'Espoir' }
  };

  const filteredItems = coconItems.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleSaveContent = () => {
    if (newContent.title && newContent.content) {
      console.log('Nouveau contenu cocon:', {
        ...newContent,
        tags: newContent.tags.split(',').map(tag => tag.trim()),
        date: new Date().toISOString()
      });
      
      setNewContent({ type: 'reflection', title: '', content: '', isPrivate: true, tags: '' });
      setIsCreating(false);
    }
  };

  if (isCreating) {
    return (
      <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setIsCreating(false)}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créer un moment cocon</h1>
              <p className="text-gray-600">Préservez vos pensées et émotions précieuses</p>
            </div>
          </div>

          {/* Formulaire de création */}
          <Card>
            <CardHeader>
              <CardTitle>Nouveau contenu pour votre cocon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type de contenu */}
              <div>
                <label className="text-sm font-medium mb-3 block">Type de contenu</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(contentTypes).map(([type, config]) => (
                    <Card
                      key={type}
                      className={`cursor-pointer transition-all ${
                        newContent.type === type ? 'ring-2 ring-emerald-500 bg-emerald-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setNewContent(prev => ({ ...prev, type: type as any }))}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{config.icon}</div>
                        <div className="font-medium text-sm">{config.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{config.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="text-sm font-medium mb-2 block">Titre</label>
                <Input
                  placeholder="Donnez un titre à ce moment..."
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Contenu */}
              <div>
                <label className="text-sm font-medium mb-2 block">Vos pensées</label>
                <Textarea
                  placeholder="Exprimez vos pensées, émotions ou souvenirs..."
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="text-sm font-medium mb-2 block">Mots-clés (séparés par des virgules)</label>
                <Input
                  placeholder="paix, nature, famille, bonheur..."
                  value={newContent.tags}
                  onChange={(e) => setNewContent(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              {/* Confidentialité */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newContent.isPrivate}
                  onChange={(e) => setNewContent(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label className="text-sm">
                  Garder ce contenu privé (visible seulement par vous)
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveContent} className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Ajouter à mon cocon
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/b2c/dashboard')}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mon Cocon Personnel</h1>
              <p className="text-gray-600">Votre espace de bien-être et de réflexion</p>
            </div>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau moment
          </Button>
        </div>

        {/* Statistiques du cocon */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{coconItems.length}</div>
              <div className="text-sm text-gray-600">Moments préservés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">21</div>
              <div className="text-sm text-gray-600">Jours actifs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Moments partagés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">😊</div>
              <div className="text-sm text-gray-600">Humeur dominante</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Rechercher dans votre cocon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">Tous les types</option>
              {Object.entries(contentTypes).map(([type, config]) => (
                <option key={type} value={type}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Types de contenu - Navigation rapide */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            Tous
          </Button>
          {Object.entries(contentTypes).map(([type, config]) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              onClick={() => setSelectedType(type)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <span>{config.icon}</span>
              {config.label}
            </Button>
          ))}
        </div>

        {/* Grille de contenu */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Votre cocon vous attend</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || selectedType !== 'all' 
                    ? 'Aucun moment trouvé avec ces critères'
                    : 'Commencez à créer votre premier moment cocon'
                  }
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier moment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const typeInfo = contentTypes[item.type];
                const moodInfo = moodConfig[item.mood];
                const MoodIcon = moodInfo.icon;
                
                return (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={typeInfo.color}>
                          {typeInfo.icon} {typeInfo.label}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${moodInfo.color} text-white`}>
                            <MoodIcon className="w-3 h-3" />
                          </div>
                          {!item.isPrivate && <Share2 className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">{item.title}</h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-4 mb-4">{item.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-xs text-gray-500">
                          {item.date.toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Inspiration du jour */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🌱</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Inspiration du jour</h3>
                <p className="text-emerald-100 mb-4">
                  "Prenez le temps de vous reconnecter avec vous-même. Chaque moment de calme nourrit votre bien-être intérieur."
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsCreating(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Créer un moment de gratitude
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CCoconPage;