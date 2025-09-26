import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PenTool, Save, Mic, Image, Heart, Calendar, Tag } from 'lucide-react';

export default function JournalNewPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const moods = [
    { emoji: '😊', label: 'Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { emoji: '😌', label: 'Calme', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😔', label: 'Triste', color: 'bg-gray-100 text-gray-800' },
    { emoji: '😠', label: 'Colère', color: 'bg-red-100 text-red-800' },
    { emoji: '😴', label: 'Fatigué', color: 'bg-purple-100 text-purple-800' },
    { emoji: '🤗', label: 'Reconnaissant', color: 'bg-green-100 text-green-800' }
  ];

  const handleSave = () => {
    // Logic to save journal entry
    console.log('Saving entry:', { title, content, mood, tags });
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <PenTool className="h-8 w-8 mr-3 text-purple-600" />
            Nouvelle Entrée Journal
          </h1>
          <p className="text-gray-600">Exprimez vos pensées et émotions du moment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-500" />
                  Écriture libre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre de l'entrée</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Donnez un titre à votre entrée..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Votre journal</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez librement vos pensées, émotions, expériences de la journée..."
                    rows={12}
                    className="resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {content.length} caractères
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRecording(!isRecording)}
                    className={isRecording ? 'text-red-600 border-red-300' : ''}
                  >
                    <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                    {isRecording ? 'Arrêter l\'enregistrement' : 'Enregistrer audio'}
                  </Button>
                  <Button variant="outline">
                    <Image className="h-4 w-4 mr-2" />
                    Ajouter photo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Humeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment vous sentez-vous ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map((m) => (
                    <Badge
                      key={m.label}
                      variant={mood === m.label ? 'default' : 'outline'}
                      className={`cursor-pointer p-3 justify-center hover:scale-105 transition-transform ${
                        mood === m.label ? m.color : ''
                      }`}
                      onClick={() => setMood(mood === m.label ? '' : m.label)}
                    >
                      <span className="text-lg mr-2">{m.emoji}</span>
                      {m.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Informations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Suggestions d'écriture</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Qu'est-ce qui vous a marqué aujourd'hui ?</li>
                  <li>• Pour quoi êtes-vous reconnaissant ?</li>
                  <li>• Quel défi avez-vous relevé ?</li>
                  <li>• Comment vous sentez-vous maintenant ?</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer avec statistiques */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Journal personnel · Données cryptées</span>
              <div className="flex items-center space-x-4">
                <span>Entrées ce mois: 12</span>
                <span>Série en cours: 5 jours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}